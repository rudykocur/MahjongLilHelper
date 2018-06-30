import * as s from '../js/scoring.js';
import * as g from '../js/game.js';
import * as h from '../js/hand.js';

function createGame() {
    return new g.Game(new g.Player(0, 'P1'), new g.Player(1, 'P2'), new g.Player(2, 'P3'), new g.Player(3, 'P4'));
}

function scoreHand(round, player, value) {
    let scoring = s.ScoreCalculator.createDefaultScoreCalculator();

    chai.expect(scoring.calculateScore(round, player)).to.equal(value);
}

describe('scoring simple sets', () => {

    let game, round, hand;

    beforeEach(() => {
        game = createGame();

        round = game.createRound();

        hand = new h.Hand();
    });

    it('scoring bonus tile', () => {
        hand.addTile(h.Tiles.BonusFlower2);

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 4);
    });

    it('scoring pair', () => {
        hand.addSet(new h.Pair(h.Tiles.Bamboo1));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 0);
    });

    it('scoring pair of dragons', () => {
        hand.addSet(new h.Pair(h.Tiles.DragonGreen));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 2);
    });

    it('scoring pair - insignificant wind', () => {
        hand.addSet(new h.Pair(h.Tiles.WindWest));

        round.setHand(game.players[1], hand);

        scoreHand(round, game.players[1], 0);
    });

    it('scoring pair - wind of round', () => {
        hand.addSet(new h.Pair(h.Tiles.WindEast));

        round.setHand(game.players[1], hand);

        scoreHand(round, game.players[1], 2);
    });

    it('scoring pair - wind of player', () => {
        hand.addSet(new h.Pair(h.Tiles.WindWest));

        round.setHand(game.players[2], hand);

        scoreHand(round, game.players[2], 2);
    });

    it('scoring pair - wind of round and own wind', () => {
        hand.addSet(new h.Pair(h.Tiles.WindEast));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 4);
    });

    it('scoring chow', () => {
        hand.addSet(new h.Chow(false, h.Tiles.Bamboo1, h.Tiles.Bamboo2, h.Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 0);
    });

    it('scoring revealed common pung', () => {
        hand.addSet(new h.Pung(true, h.Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 2)
    });

    it('scoring concealed common pung', () => {
        hand.addSet(new h.Pung(false, h.Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 4)
    });

    it('scoring revealed common kong', () => {
        hand.addSet(new h.Kong(true, h.Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 8)
    });

    it('scoring concealed common kong', () => {
        hand.addSet(new h.Kong(false, h.Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 16)
    });

    [h.Tiles.Bamboo1, h.Tiles.WindWest].forEach((tile) => {
        it('scoring concealed uncommon pung with ' + tile, () => {
            hand.addSet(new h.Pung(false, tile));

            round.setHand(game.players[0], hand);

            scoreHand(round, game.players[0], 8)
        });

        it('scoring revealed uncommon pung with ' + tile, () => {
            hand.addSet(new h.Pung(true, tile));

            round.setHand(game.players[0], hand);

            scoreHand(round, game.players[0], 4)
        });

        it('scoring concealed uncommon kong with ' + tile, () => {
            hand.addSet(new h.Kong(false, tile));

            round.setHand(game.players[0], hand);

            scoreHand(round, game.players[0], 32)
        });

        it('scoring revealed uncommon kong with ' + tile, () => {
            hand.addSet(new h.Kong(true, tile));

            round.setHand(game.players[0], hand);

            scoreHand(round, game.players[0], 16)
        });
    });
});

describe('scoring multiple sets', () => {
    let game, round, hand;

    beforeEach(() => {
        game = createGame();

        round = game.createRound();

        hand = new h.Hand();
    });

    it('scoring multiple bonus tiles', () => {
        hand.addTile(h.Tiles.BonusFlower3);
        hand.addTile(h.Tiles.BonusFlower1);
        hand.addTile(h.Tiles.BonusSummer);

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 12)
    });

    it('scoring tree pungs', () => {
        hand.addSet(new h.Pung(true, h.Tiles.Bamboo3));
        hand.addSet(new h.Pung(false, h.Tiles.Bamboo1));
        hand.addSet(new h.Pung(false, h.Tiles.WindSouth));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 18)
    });

    it('scoring mixed sets', () => {
        hand.addSet(new h.Pung(true, h.Tiles.Bamboo3));
        hand.addSet(new h.Kong(false, h.Tiles.Bamboo1));
        hand.addSet(new h.Pung(true, h.Tiles.WindSouth));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 38)
    })
});

describe('scoring winning conditions', () => {
    let game, round, hand;

    beforeEach(() => {
        game = createGame();

        round = game.createRound();

        hand = new h.Hand();
    });

    it('scoring flower with mahjong', () => {
        hand.addSet(new h.FreeTiles(h.Tiles.BonusFlower1));

        round.setHand(game.players[1], hand);
        round.setWinner(game.players[1], false, false);

        scoreHand(round, game.players[1], 24);
    });

    it('bonus for mahjong', () => {
        hand.addSet(new h.Pung(true, h.Tiles.Circle2));
        hand.addSet(new h.Chow(true, h.Tiles.Bamboo1, h.Tiles.Bamboo2, h.Tiles.Bamboo3));

        round.setHand(game.players[1], hand);
        round.setWinner(game.players[1], false, false);

        scoreHand(round, game.players[1], 22)
    });

    it('bonus for mahjong and last avaiable tile', () => {
        hand.addSet(new h.Pung(true, h.Tiles.Circle2));
        hand.addSet(new h.Chow(true, h.Tiles.Bamboo1, h.Tiles.Bamboo2, h.Tiles.Bamboo3));

        round.setHand(game.players[1], hand);
        round.setWinner(game.players[1], true, false);

        scoreHand(round, game.players[1], 24)
    });

    it('bonus for mahjong and last tile from wall', () => {
        hand.addSet(new h.Pung(true, h.Tiles.Circle2));
        hand.addSet(new h.Chow(true, h.Tiles.Bamboo1, h.Tiles.Bamboo2, h.Tiles.Bamboo3));

        round.setHand(game.players[1], hand);
        round.setWinner(game.players[1], false, true);

        scoreHand(round, game.players[1], 24)
    });
});

describe('scoring multipliers', () => {
    let game, round, hand;

    beforeEach(() => {
        game = createGame();

        round = game.createRound();

        hand = new h.Hand();
    });

    it('multiplier for dragon set', () => {
        hand.addSet(new h.Pung(true, h.Tiles.DragonRed));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 8)
    });

    it('multiplier for set of round wind', () => {
        hand.addSet(new h.Pung(true, h.Tiles.WindEast));

        round.setHand(game.players[2], hand);

        scoreHand(round, game.players[2], 8)
    });

    it('multiplier for set of own wind', () => {
        hand.addSet(new h.Pung(true, h.Tiles.WindWest));

        round.setHand(game.players[2], hand);

        scoreHand(round, game.players[2], 8)
    });

    it('multiplier for three concealed pungs', () => {
        hand.addSet(new h.Pung(false, h.Tiles.Bamboo2));
        hand.addSet(new h.Pung(false, h.Tiles.Bamboo2));
        hand.addSet(new h.Pung(false, h.Tiles.Circle2));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 24);
    });

    it('three little sages set', () => {
        hand.addSet(new h.Pung(true, h.Tiles.DragonRed));
        hand.addSet(new h.Kong(false, h.Tiles.DragonWhite));
        hand.addSet(new h.Pair(h.Tiles.DragonGreen));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 304);
    });

    it('three little sages set - broken', () => {
        hand.addSet(new h.Pung(true, h.Tiles.DragonRed));
        hand.addSet(new h.Kong(false, h.Tiles.DragonWhite));
        hand.addSet(new h.Pair(h.Tiles.Bamboo2));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 144);
    });

    it('four little blessings set', () => {
        hand.addSet(new h.Pung(true, h.Tiles.WindWest));
        hand.addSet(new h.Kong(false, h.Tiles.WindSouth));
        hand.addSet(new h.Kong(true, h.Tiles.WindNorth));
        hand.addSet(new h.Pair(h.Tiles.WindEast));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 112);
    });

    it('three grand sages set', () => {
        hand.addSet(new h.Pung(true, h.Tiles.DragonRed));
        hand.addSet(new h.Kong(false, h.Tiles.DragonWhite));
        hand.addSet(new h.Pung(false, h.Tiles.DragonGreen));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 1408);
    });

    it('four grand blessings set', () => {
        hand.addSet(new h.Pung(true, h.Tiles.WindWest));
        hand.addSet(new h.Kong(false, h.Tiles.WindSouth));
        hand.addSet(new h.Kong(true, h.Tiles.WindNorth));
        hand.addSet(new h.Pung(false, h.Tiles.WindEast));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 960);
    });

    it('pure chows mahjong multiplier', () => {
        hand.addSet(new h.Chow(false, h.Tiles.Bamboo1, h.Tiles.Bamboo2, h.Tiles.Bamboo3));
        hand.addSet(new h.Chow(false, h.Tiles.Circle1, h.Tiles.Circle2, h.Tiles.Circle3));
        hand.addSet(new h.Chow(false, h.Tiles.Character1, h.Tiles.Character2, h.Tiles.Character3));
        hand.addSet(new h.Chow(false, h.Tiles.Character1, h.Tiles.Character2, h.Tiles.Character3));
        hand.addSet(new h.Pair(h.Tiles.WindWest));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], 40);
    });

    it('pure chows mahjong - no multiplier, valued pair', () => {
        hand.addSet(new h.Chow(false, h.Tiles.Bamboo1, h.Tiles.Bamboo2, h.Tiles.Bamboo3));
        hand.addSet(new h.Chow(false, h.Tiles.Circle1, h.Tiles.Circle2, h.Tiles.Circle3));
        hand.addSet(new h.Chow(false, h.Tiles.Character1, h.Tiles.Character2, h.Tiles.Character3));
        hand.addSet(new h.Chow(false, h.Tiles.Character1, h.Tiles.Character2, h.Tiles.Character3));
        hand.addSet(new h.Pair(h.Tiles.DragonGreen));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], 22);
    });

    it('no chows mahjong multiplier', () => {
        hand.addSet(new h.Pung(true, h.Tiles.Bamboo2));
        hand.addSet(new h.Pung(true, h.Tiles.Bamboo3));
        hand.addSet(new h.Pung(true, h.Tiles.Circle2));
        hand.addSet(new h.Pung(true, h.Tiles.Circle3));
        hand.addSet(new h.Pair(h.Tiles.Bamboo1));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], (20+2+2+2+2) * 2);
    });

    it('half color multiplier', () => {
        hand.addSet(new h.Pung(true, h.Tiles.Bamboo2));
        hand.addSet(new h.Pung(true, h.Tiles.Bamboo3));
        hand.addSet(new h.Chow(false, h.Tiles.Bamboo1, h.Tiles.Bamboo2, h.Tiles.Bamboo3));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], (20+2+2) * 2);
    })
});

