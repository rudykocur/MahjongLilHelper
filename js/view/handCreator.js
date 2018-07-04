import {Suits, Pung, Kong, Chow, Pair, TileGroups, FreeTiles} from "../hand.js";
import {EventEmitter} from "../utils.js";
import {domLoader} from "./templates.js";

import {dependencies} from 'needlepoint';
import {GamePanel} from "./gamePanel";
import {renderTile} from "./utils";

@dependencies(domLoader('hand'))
class HandCreatorView extends GamePanel{

    /**
     * @param {DomTemplate} template
     */
    constructor(template) {
        super(template.getRoot());

        this.onEditFinish = new EventEmitter();

        this.allTiles = [];
        this.addedSets = [];

        this.suitGroups = this.root.querySelector('.suitGroups');
        this.handContents = this.root.querySelector('.handContent');
        this.handScoreRules = this.root.querySelector('.handScoreRules');

        this.handRevealedInput = this.root.elements['revealed'];
        this.isWinnerInput = this.root.elements['isWinner'];
        this.lastTileFromWallInput = this.root.elements['lastTileFromWall'];
        this.lastAvailableTileInput = this.root.elements['lastAvailableTile'];
        this.lastTileSpecialInput = this.root.elements['lastTileSpecial'];

        this.playerNameSlot = this.root.querySelector('[data-slot="playerName"]');
        this.roundNumberSlot = this.root.querySelector('[data-slot="roundNumber"]');

        this.btnFinishHand = this.root.querySelector('[data-action="finishHand"]');

        this.btnAddPair = this.root.querySelector('[data-action="addPair"]');
        this.btnAddChow = this.root.querySelector('[data-action="addChow"]');
        this.btnAddPung = this.root.querySelector('[data-action="addPung"]');
        this.btnAddKong = this.root.querySelector('[data-action="addKong"]');
        this.btnAddTiles = this.root.querySelector('[data-action="addTiles"]');

        this.root.addEventListener('submit', e => e.preventDefault());

        this.btnAddChow.addEventListener('click', () => {
            this.onNewSetClicked(tiles => {
                if(tiles.length !== 3) {
                    return null;
                }
                return new Chow(this.getHandRevealedValue(), ...tiles)
            })
        });

        this.btnAddPung.addEventListener('click', () => {
            this.onNewSetClicked(tiles => {
                if(tiles.length !== 1) {
                    return null
                }
                return new Pung(this.getHandRevealedValue(), tiles[0])
            })
        });

        this.btnAddKong.addEventListener('click', () => {
            this.onNewSetClicked(tiles => {
                if(tiles.length !== 1) {
                    return null
                }
                return new Kong(this.getHandRevealedValue(), tiles[0])
            })
        });

        this.btnAddPair.addEventListener('click', () => {
            this.onNewSetClicked(tiles => {
                if(tiles.length !== 1) {
                    return null
                }
                return new Pair(tiles[0])
            })
        });

        this.btnAddTiles.addEventListener('click', () => {
            this.onNewSetClicked(tiles => {
                if(tiles.length < 1) {
                    return null
                }
                return new FreeTiles(tiles)
            })
        });

        this.btnFinishHand.addEventListener('click', () => {
            let tilesets = this.addedSets.map(s => s.tileset);
            this.onEditFinish.emit({
                round: this.currentEdit.round,
                player: this.currentEdit.player,
                tilesets: tilesets,
                isWinner: this.isWinnerInput.checked,
                lastTileFromWall: this.lastTileFromWallInput.checked,
                lastAvailableTile: this.lastAvailableTileInput.checked,
                lastTileSpecial: this.lastTileSpecialInput.checked,
            });
        });
    }

    initUI() {
        [Suits.BAMBOO, Suits.CIRCLE, Suits.CHARACTER, Suits.WIND, Suits.DRAGON, Suits.BONUS].forEach(suitType => {
            let group = this.renderTileGroup(TileGroups[suitType]);

            this.suitGroups.appendChild(group);
        })
    }

    /**
     * @param {Round} round
     * @param {Player} player
     */
    showHand(round, player) {
        this.addedSets = [];

        this.refreshHandContent();

        let hand = round.getHand(player).hand;

        if(hand) {
            hand.sets.forEach(s => this.renderNewTileset(s));

            let score = round.scoreCalculator.calculateExtendedScore(round, player);

            this.renderScoreRules(score);
        }

        this.roundNumberSlot.textContent = round.roundNumber;
        this.playerNameSlot.textContent = player.name;

        this.currentEdit = {
            player: player,
            round: round,
        }
    }

    renderScoreRules(score) {
        while(this.handScoreRules.firstChild) {
            this.handScoreRules.removeChild(this.handScoreRules.firstChild);
        }

        let rules = [].concat(
            ...score.points.map(rule => `${rule.rule.constructor.name}: +${rule.amount}`),
            ...score.multipliers.map(rule => `${rule.rule.constructor.name}: x${rule.amount}`)
        );

        rules.forEach(ruleStr => {
            let ruleNode = this.handScoreRules.appendChild(document.createElement('div'));
            ruleNode.textContent = ruleStr;
        })

    }

    renderTileGroup(tiles) {
        let result = document.createElement('ul');

        tiles.forEach(tile => {
            let tileView = new HandCreatorTileView(tile);
            this.allTiles.push(tileView);
            result.appendChild(tileView.view);
        });

        return result;
    }

    onNewSetClicked(callback) {
        let tiles = this.allTiles.filter(t => t.selected).map(t => t.tile);

        let newSet = callback(tiles);

        if(newSet !== null) {
            this.renderNewTileset(newSet);
        }

        this.allTiles.forEach(t => t.resetSelected());
    }

    renderNewTileset(tileset) {
        let view = this.renderNewTiles(tileset, tileset.tiles, tileset.isRevealed);

        view.onRemove.addListener(() => {
            this.addedSets.splice(this.addedSets.indexOf(view), 1);
            this.refreshHandContent();
        });


        this.addedSets.push(view);
    }

    renderNewTiles(tileset, tiles, revealed) {
        let view = new HandAddedTilesView(tileset, tiles, revealed || false);

        this.handContents.appendChild(view.view);

        return view;
    }

    refreshHandContent() {
        while(this.handContents.firstChild) {
            this.handContents.removeChild(this.handContents.firstChild);
        }

        this.addedSets.forEach(setView => {
            this.handContents.appendChild(setView.view);
        })
    }

    getHandRevealedValue() {
        return !!this.handRevealedInput.value;
    }
}



class HandCreatorTileView {
    constructor(tile) {
        this.tile = tile;
        this.selected = false;
        this.view = document.createElement('li');
        this.view.appendChild(renderTile(tile));

        this.view.addEventListener('click', () => {
            this.selected = !this.selected;

            this.view.classList.toggle('selected', this.selected);
        })
    }

    resetSelected() {
        this.selected = false;
        this.view.classList.remove('selected');
    }
}

class HandAddedTilesView {
    constructor(tileset, tiles, revealed) {
        this.tiles = tiles;
        this.tileset = tileset;

        this.onRemove = new EventEmitter();
        this.view = document.createElement('ul');

        if(revealed) {
            this.view.classList.add('revealedSet');
        }

        this.tiles.forEach(tile => {
            let row = this.view.appendChild(document.createElement('li'));
            row.appendChild(renderTile(tile));
        });

        let delButton = this.view.appendChild(document.createElement('li'));
        delButton.classList.add('actionDelete');

        delButton.appendChild(document.createTextNode('X'));
        delButton.addEventListener('click', () => {
            this.onRemove.emit();
        })
    }
}

export {HandCreatorView}