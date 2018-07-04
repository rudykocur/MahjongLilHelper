import {Game, Player} from "../js/game";
import {GameSerializer, MahjongDatabase} from "../js/db";
import {Chow, FreeTiles, Hand, Kong, Pair, Pung, Tiles} from "../js/hand";

const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').use(require('sinon-chai'));

/**
 * @return {Game}
 */
function createGame() {
    return new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4'));
}

describe('Database access tests', () => {

    it('serialize game', () => {
        let serializer = new GameSerializer();

        let game = createGame();
        let round1 = game.createRound();
        let round2 = game.createRound();

        let p1r1Hand = new Hand();
        p1r1Hand.addSet(new Pung(true, Tiles.Bamboo3));
        p1r1Hand.addSet(new Kong(false, Tiles.Bamboo2));
        round1.setHand(game.players[0], p1r1Hand);

        let p2r1Hand = new Hand();
        p2r1Hand.addSet(new Pair(Tiles.Bamboo4));
        p2r1Hand.addSet(new Chow(false, Tiles.Circle2, Tiles.Circle3, Tiles.Circle4));
        round1.setHand(game.players[1], p2r1Hand);

        let p3r1Hand = new Hand();
        p3r1Hand.addSet(new FreeTiles([Tiles.BonusFlower1, Tiles.BonusFlower4, Tiles.BonusSummer]));
        round1.setHand(game.players[2], p3r1Hand);

        round1.setWinner(game.players[3], true, true);

        let gameJson = serializer.serialize(game);

        let expectedGameJson = {
            players: [
                {name: 'P1', seatNumber: 0},
                {name: 'P2', seatNumber: 1},
                {name: 'P3', seatNumber: 2},
                {name: 'P4', seatNumber: 3},
            ],
            rounds: [
                {
                    winner: 3,
                    lastAvailableTile: true,
                    lastTileFromWall: true,
                    hands: [
                        [  // Player 1 hand, round 1
                            {
                                type: 'pung',
                                isRevealed: true,
                                tile: 'Bamboo3',
                            },
                            {
                                type: 'kong',
                                isRevealed: false,
                                tile: 'Bamboo2',
                            }
                        ],
                        [  // Player 2 hand, round 1
                            {
                                type: 'pair',
                                tile: 'Bamboo4',
                            },
                            {
                                type: 'chow',
                                isRevealed: false,
                                tiles: ['Circle2', 'Circle3', 'Circle4']
                            }
                        ],
                        [  // Player 3 hand, round 1
                            {
                                type: 'free',
                                tiles: ['BonusFlower1', 'BonusFlower4', 'BonusSummer'],
                            }
                        ],
                        null]
                },
                {
                    winner: null,
                    lastAvailableTile: false,
                    lastTileFromWall: false,
                    hands: [null, null, null, null]
                },
            ]
        };

        expect(gameJson).to.be.eql(expectedGameJson);
    });

    it('serialize partial round', () => {
        let serializer = new GameSerializer();

        let game = createGame();
        let round1 = game.createRound();

        let p1r1Hand = new Hand();
        p1r1Hand.addSet(new Pung(true, Tiles.Bamboo3));
        p1r1Hand.addSet(new Kong(false, Tiles.Bamboo2));
        round1.setHand(game.players[0], p1r1Hand);

        round1.setWinner(game.players[0], false, false);

        let gameJson = serializer.serialize(game);

        let expectedGameJson = {
            players: [
                {name: 'P1', seatNumber: 0},
                {name: 'P2', seatNumber: 1},
                {name: 'P3', seatNumber: 2},
                {name: 'P4', seatNumber: 3},
            ],
            rounds: [
                {
                    winner: 0,
                    lastAvailableTile: false,
                    lastTileFromWall: false,
                    hands: [
                        [  // Player 1 hand, round 1
                            {
                                type: 'pung',
                                isRevealed: true,
                                tile: 'Bamboo3',
                            },
                            {
                                type: 'kong',
                                isRevealed: false,
                                tile: 'Bamboo2',
                            }
                        ],
                        null,
                        null,
                        null]
                }
            ]
        };

        expect(gameJson).to.be.eql(expectedGameJson);
    });

    it('deserialize game', () => {
        let serializer = new GameSerializer();

        let gameSave = {
            players: [
                {name: 'P1', seatNumber: 0},
                {name: 'P2', seatNumber: 1},
                {name: 'P3', seatNumber: 2},
                {name: 'P4', seatNumber: 3},
            ],
            rounds: [
                {
                    winner: 3,
                    lastAvailableTile: true,
                    lastTileFromWall: true,
                    hands: [
                        [  // Player 1 hand, round 1
                            {
                                type: 'pung',
                                isRevealed: true,
                                tile: 'Bamboo3',
                            },
                            {
                                type: 'kong',
                                isRevealed: false,
                                tile: 'Bamboo2',
                            }
                        ],
                        [  // Player 2 hand, round 1
                            {
                                type: 'pair',
                                tile: 'Bamboo4',
                            },
                            {
                                type: 'chow',
                                isRevealed: false,
                                tiles: ['Circle2', 'Circle3', 'Circle4']
                            }
                        ],
                        [  // Player 3 hand, round 1
                            {
                                type: 'free',
                                tiles: ['BonusFlower1', 'BonusFlower4', 'BonusSummer'],
                            }
                        ],
                        null]
                },
                {
                    winner: null,
                    lastAvailableTile: false,
                    lastTileFromWall: false,
                    hands: [null, null, null, null]
                },
            ]
        };

        /**
         * @type {Game}
         */
        let loadedGame = serializer.deserialize(gameSave);

        expect(loadedGame.players).to.be.eql([
            new Player(0, 'P1'),
            new Player(1, 'P2'),
            new Player(2, 'P3'),
            new Player(3, 'P4'),
        ]);

        expect(loadedGame.rounds.length).to.be.equal(2);

        /**
         * @type {Round}
         */
        let round1 = loadedGame.rounds[0];

        expect(round1.winner).to.be.eql(loadedGame.players[3]);
        expect(round1.lastTileFromWall).to.be.equal(true);
        expect(round1.lastAvailableTile).to.be.equal(true);

        expect(round1.getHand(loadedGame.players[0]).hand.sets).to.be.eql([
            new Pung(true, Tiles.Bamboo3),
            new Kong(false, Tiles.Bamboo2)
        ]);

        expect(round1.getHand(loadedGame.players[1]).hand.sets).to.be.eql([
            new Pair(Tiles.Bamboo4),
            new Chow(false, Tiles.Circle2, Tiles.Circle3, Tiles.Circle4)
        ]);

        expect(round1.getHand(loadedGame.players[2]).hand.sets).to.be.eql([
            new FreeTiles([Tiles.BonusFlower1, Tiles.BonusFlower4, Tiles.BonusSummer])
        ]);

        expect(round1.getHand(loadedGame.players[3]).hand).to.be.eql(null);

        let round2 = loadedGame.rounds[1];

        expect(round2.winner).to.be.eql(null);
        expect(round2.lastTileFromWall).to.be.equal(false);
        expect(round2.lastAvailableTile).to.be.equal(false);

        expect(round2.getHand(loadedGame.players[0]).hand).to.be.eql(null);
        expect(round2.getHand(loadedGame.players[1]).hand).to.be.eql(null);
        expect(round2.getHand(loadedGame.players[2]).hand).to.be.eql(null);
        expect(round2.getHand(loadedGame.players[3]).hand).to.be.eql(null);
    });

    it('test loading games from database', () => {
        let storageMock = {
            getItem: sinon.fake(() => '[{"data": "foo"}, {"data": "bar"}]')
        };

        let storageDriverMock = {
            getDriver: sinon.fake(() => storageMock)
        };

        let serializerMock = {
            deserialize: sinon.spy(data => data)
        };

        let db = new MahjongDatabase(storageDriverMock, serializerMock);
        let games = db.load();

        expect(storageMock.getItem).calledOnce;
        expect(serializerMock.deserialize).calledTwice;

        expect(storageMock.getItem).calledWithExactly('mahjongGames');

        expect(games).to.be.eql([
            {data: "foo"},
            {data: "bar"}
        ])
    });

    it('test loading empty data from storage', () => {
        let storageMock = {
            getItem: sinon.fake(() => null)
        };

        let storageDriverMock = {
            getDriver: sinon.fake(() => storageMock)
        };

        let serializerMock = {
            deserialize: sinon.spy(data => data)
        };

        let db = new MahjongDatabase(storageDriverMock, serializerMock);
        let games = db.load();
    });

    it('test saving games to database', () => {
        let storageMock = {
            setItem: sinon.fake()
        };

        let storageDriverMock = {
            getDriver: sinon.fake(() => storageMock)
        };

        let serializerMock = {
            serialize: sinon.spy(data => data)
        };

        let db = new MahjongDatabase(storageDriverMock, serializerMock);

        db.save([{data: 'game1'}, {data: 'game2'}]);

        expect(storageMock.setItem).calledOnce;
        expect(serializerMock.serialize).calledTwice;

        expect(storageMock.setItem).calledWithExactly('mahjongGames', '[{"data":"game1"},{"data":"game2"}]');
    })
});