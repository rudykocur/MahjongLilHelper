
import {dependencies} from 'needlepoint';
import {Chow, FreeTiles, Hand, Kong, Pair, Pung, Tiles} from "./hand";
import {Game, Player} from "./game";

export class LocalStorageDriver {
    /**
     * @return {Storage}
     */
    getDriver() {
        return window.localStorage;
    }
}

export class GameSerializer {
    /**
     * @param {Game} game
     */
    serialize(game) {
        let result = {
            players: game.players.map(p => {return {name: p.name, seatNumber: p.seatNumber}}),
            rounds: game.rounds.map(round => {
                return {
                    winner: round.winner ? round.winner.seatNumber : null,
                    lastAvailableTile: round.lastAvailableTile,
                    lastTileFromWall: round.lastTileFromWall,
                    hands: round.hands.map(hand => hand.hand ? this._serializeHand(hand.hand) : null)
                }
            }),
        };

        return result;
    }

    deserialize(gameJson) {
        let players = gameJson.players.map(playerData => new Player(playerData.seatNumber, playerData.name));

        let game = new Game(...players);

        gameJson.rounds.forEach(roundData => {
            let round = game.createRound();

            roundData.hands.forEach((handData, playerIndex) => {
                if(handData === null) {
                    return;
                }

                let hand = new Hand();

                handData.forEach(setData => {
                    hand.addSet(this._deserializeTileset(setData));
                });

                round.setHand(players[playerIndex], hand);
            });

            if(roundData.winner !== null) {
                round.setWinner(players[roundData.winner], roundData.lastAvailableTile, roundData.lastTileFromWall);
            }
        });

        return game;
    }

    /**
     * @param {Hand} hand
     */
    _serializeHand(hand) {
        return hand.sets.map(this._serializeTileset, this);
    }

    /**
     * @param {TileSet} tileset
     */
    _serializeTileset(tileset) {
        if(tileset instanceof Kong) {
            return {
                type: 'kong',
                isRevealed: tileset.isRevealed,
                tile: this._getTileCode(tileset.getTile())
            }
        }

        if(tileset instanceof Pung) {
            return {
                type: 'pung',
                isRevealed: tileset.isRevealed,
                tile: this._getTileCode(tileset.getTile()),
            }
        }

        if(tileset instanceof Chow) {
            return {
                type: 'chow',
                isRevealed: tileset.isRevealed,
                tiles: tileset.tiles.map(tile => this._getTileCode(tile))
            }
        }

        if(tileset instanceof Pair) {
            return {
                type: 'pair',
                tile: this._getTileCode(tileset.getTile()),
            }
        }

        if(tileset instanceof FreeTiles) {
            return {
                type: 'free',
                tiles: tileset.tiles.map(tile => this._getTileCode(tile))
            }
        }
    }

    /**
     * @param {Tile} tile
     */
    _getTileCode(tile) {
        return Object.keys(Tiles).map(tileKey => {
            if(Tiles[tileKey].equals(tile)) {
                return tileKey;
            }
        }).filter(key => key)[0];
    }

    _deserializeTileset(setData) {
        if(setData.type === 'kong') {
            return new Kong(setData.isRevealed, Tiles[setData.tile]);
        }

        if(setData.type === 'pung') {
            return new Pung(setData.isRevealed, Tiles[setData.tile]);
        }

        if(setData.type === 'chow') {
            return new Chow(setData.isRevealed, Tiles[setData.tiles[0]],
                Tiles[setData.tiles[1]], Tiles[setData.tiles[2]])
        }

        if(setData.type === 'pair') {
            return new Pair(Tiles[setData.tile]);
        }

        if(setData.type === 'free') {
            return new FreeTiles(setData.tiles.map(tile => Tiles[tile]));
        }
    }
}


@dependencies(LocalStorageDriver, GameSerializer)
export class MahjongDatabase {

    /**
     * @param {LocalStorageDriver} storage
     * @param {GameSerializer} serializer
     */
    constructor(storage, serializer) {
        this.storage = storage.getDriver();
        this.serializer = serializer;

        this.storageKey = 'mahjongGames';
    }

    load() {
        let gamesStr  = this.storage.getItem(this.storageKey);

        let games = JSON.parse(gamesStr);

        if(games !== null) {
            return games.map(this.serializer.deserialize, this.serializer);
        }

        return [];
    }

    save(games) {
        let gamesArr = games.map(this.serializer.serialize, this.serializer);

        this.storage.setItem(this.storageKey, JSON.stringify(gamesArr));
    }
}