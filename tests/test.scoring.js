const chai = require('chai');

import {Game, Player} from "../js/game";
import {ScoreCalculator} from "../js/scoring";
import {Chow, FreeTiles, Hand, Kong, Pair, Pung, Tiles} from "../js/hand";

function createGame() {
    return new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4'));
}

function scoreHand(round, player, value) {
    let scoring = ScoreCalculator.createDefaultScoreCalculator();

    let score = scoring.calculateExtendedScore(round, player);

    let usedRules = [].concat(
        ...score.points.map(p => `${p.rule.constructor.name} (+${p.amount})`),
        ...score.multipliers.map(m => `${m.rule.constructor.name} (x${m.amount})`)
    );

    chai.expect(score.score, 'Used rules: '+usedRules.join(', ')).to.equal(value);
}

describe('scoring simple sets', () => {

    let game, round, hand;

    beforeEach(() => {
        game = createGame();

        round = game.createRound();

        hand = new Hand();
    });

    it('scoring bonus tile', () => {
        hand.addTile(Tiles.BonusFlower2);

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 4);
    });

    it('scoring pair', () => {
        hand.addSet(new Pair(Tiles.Bamboo1));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 0);
    });

    it('scoring pair of dragons', () => {
        hand.addSet(new Pair(Tiles.DragonGreen));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 2);
    });

    it('scoring pair - insignificant wind', () => {
        hand.addSet(new Pair(Tiles.WindWest));

        round.setHand(game.players[1], hand);

        scoreHand(round, game.players[1], 0);
    });

    it('scoring pair - wind of round', () => {
        hand.addSet(new Pair(Tiles.WindEast));

        round.setHand(game.players[1], hand);

        scoreHand(round, game.players[1], 2);
    });

    it('scoring pair - wind of player', () => {
        hand.addSet(new Pair(Tiles.WindWest));

        round.setHand(game.players[2], hand);

        scoreHand(round, game.players[2], 2);
    });

    it('scoring pair - wind of round and own wind', () => {
        hand.addSet(new Pair(Tiles.WindEast));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 4);
    });

    it('scoring chow', () => {
        hand.addSet(new Chow(false, Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 0);
    });

    it('scoring revealed common pung', () => {
        hand.addSet(new Pung(true, Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 2)
    });

    it('scoring concealed common pung', () => {
        hand.addSet(new Pung(false, Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 4)
    });

    it('scoring revealed common kong', () => {
        hand.addSet(new Kong(true, Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 8)
    });

    it('scoring concealed common kong', () => {
        hand.addSet(new Kong(false, Tiles.Bamboo3));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 16)
    });

    [Tiles.Bamboo1, Tiles.WindWest].forEach((tile) => {
        it('scoring concealed uncommon pung with ' + tile, () => {
            hand.addSet(new Pung(false, tile));

            round.setHand(game.players[0], hand);

            scoreHand(round, game.players[0], 8)
        });

        it('scoring revealed uncommon pung with ' + tile, () => {
            hand.addSet(new Pung(true, tile));

            round.setHand(game.players[0], hand);

            scoreHand(round, game.players[0], 4)
        });

        it('scoring concealed uncommon kong with ' + tile, () => {
            hand.addSet(new Kong(false, tile));

            round.setHand(game.players[0], hand);

            scoreHand(round, game.players[0], 32)
        });

        it('scoring revealed uncommon kong with ' + tile, () => {
            hand.addSet(new Kong(true, tile));

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

        hand = new Hand();
    });

    it('scoring multiple bonus tiles', () => {
        hand.addTile(Tiles.BonusFlower3);
        hand.addTile(Tiles.BonusFlower1);
        hand.addTile(Tiles.BonusSummer);

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 12)
    });

    it('scoring tree pungs', () => {
        hand.addSet(new Pung(true, Tiles.Bamboo3));
        hand.addSet(new Pung(false, Tiles.Bamboo1));
        hand.addSet(new Pung(false, Tiles.WindSouth));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 18)
    });

    it('scoring mixed sets', () => {
        hand.addSet(new Pung(true, Tiles.Bamboo3));
        hand.addSet(new Kong(false, Tiles.Bamboo1));
        hand.addSet(new Pung(true, Tiles.WindSouth));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 38)
    })
});

describe('scoring winning conditions', () => {
    let game, round, hand;

    beforeEach(() => {
        game = createGame();

        round = game.createRound();

        hand = new Hand();
    });

    it('scoring flower with mahjong', () => {
        hand.addSet(new FreeTiles(Tiles.BonusFlower1));

        round.setHand(game.players[1], hand);
        round.setWinner(game.players[1], false, false);

        scoreHand(round, game.players[1], 24);
    });

    it('bonus for mahjong', () => {
        hand.addSet(new Pung(true, Tiles.Circle2));
        hand.addSet(new Chow(true, Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3));

        round.setHand(game.players[1], hand);
        round.setWinner(game.players[1], false, false);

        scoreHand(round, game.players[1], 22)
    });

    it('bonus for mahjong and last avaiable tile', () => {
        hand.addSet(new Pung(true, Tiles.Circle2));
        hand.addSet(new Chow(true, Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3));

        round.setHand(game.players[1], hand);
        round.setWinner(game.players[1], true, false);

        scoreHand(round, game.players[1], 24)
    });

    it('bonus for mahjong and last tile from wall', () => {
        hand.addSet(new Pung(true, Tiles.Circle2));
        hand.addSet(new Chow(true, Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3));

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

        hand = new Hand();
    });

    it('multiplier for dragon set', () => {
        hand.addSet(new Pung(true, Tiles.DragonRed));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 8)
    });

    it('multiplier for set of round wind', () => {
        hand.addSet(new Pung(true, Tiles.WindEast));

        round.setHand(game.players[2], hand);

        scoreHand(round, game.players[2], 8)
    });

    it('multiplier for set of own wind', () => {
        hand.addSet(new Pung(true, Tiles.WindWest));

        round.setHand(game.players[2], hand);

        scoreHand(round, game.players[2], 8)
    });

    it('multiplier for three concealed pungs', () => {
        hand.addSet(new Pung(false, Tiles.Bamboo2));
        hand.addSet(new Pung(false, Tiles.Bamboo2));
        hand.addSet(new Pung(false, Tiles.Circle2));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 24);
    });

    it('three little sages set', () => {
        hand.addSet(new Pung(true, Tiles.DragonRed));
        hand.addSet(new Kong(false, Tiles.DragonWhite));
        hand.addSet(new Pair(Tiles.DragonGreen));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 304);
    });

    it('three little sages set - broken', () => {
        hand.addSet(new Pung(true, Tiles.DragonRed));
        hand.addSet(new Kong(false, Tiles.DragonWhite));
        hand.addSet(new Pair(Tiles.Bamboo2));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 144);
    });

    it('four little blessings set', () => {
        hand.addSet(new Pung(true, Tiles.WindWest));
        hand.addSet(new Kong(false, Tiles.WindSouth));
        hand.addSet(new Kong(true, Tiles.WindNorth));
        hand.addSet(new Pair(Tiles.WindEast));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 112);
    });

    it('three grand sages set', () => {
        hand.addSet(new Pung(true, Tiles.DragonRed));
        hand.addSet(new Kong(true, Tiles.DragonWhite));
        hand.addSet(new Pung(true, Tiles.DragonGreen));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], (4+4+16) * 2 * 2 * 2 * 2 * 2);
    });

    it('four grand blessings set', () => {
        hand.addSet(new Pung(true, Tiles.WindWest));
        hand.addSet(new Kong(false, Tiles.WindSouth));
        hand.addSet(new Kong(true, Tiles.WindNorth));
        hand.addSet(new Pung(false, Tiles.WindEast));

        round.setHand(game.players[0], hand);

        scoreHand(round, game.players[0], 960);
    });

    it('last tile special multiplier', () => {
        hand.addSet(new Chow(false, Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3));
        hand.addSet(new Pung(true, Tiles.Circle2));
        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false, true);

        scoreHand(round, game.players[0], 44);
    });

    it('pure chows mahjong multiplier', () => {
        hand.addSet(new Chow(false, Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3));
        hand.addSet(new Chow(false, Tiles.Circle1, Tiles.Circle2, Tiles.Circle3));
        hand.addSet(new Chow(false, Tiles.Character1, Tiles.Character2, Tiles.Character3));
        hand.addSet(new Chow(false, Tiles.Character1, Tiles.Character2, Tiles.Character3));
        hand.addSet(new Pair(Tiles.WindWest));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], 40);
    });

    it('pure chows mahjong - no multiplier, valued pair', () => {
        hand.addSet(new Chow(false, Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3));
        hand.addSet(new Chow(false, Tiles.Circle1, Tiles.Circle2, Tiles.Circle3));
        hand.addSet(new Chow(false, Tiles.Character1, Tiles.Character2, Tiles.Character3));
        hand.addSet(new Chow(false, Tiles.Character1, Tiles.Character2, Tiles.Character3));
        hand.addSet(new Pair(Tiles.DragonGreen));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], 22);
    });

    it('no chows mahjong multiplier', () => {
        hand.addSet(new Pung(true, Tiles.Bamboo2));
        hand.addSet(new Pung(true, Tiles.Bamboo3));
        hand.addSet(new Pung(true, Tiles.Circle2));
        hand.addSet(new Pung(true, Tiles.Circle3));
        hand.addSet(new Pair(Tiles.Bamboo1));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], (20+2+2+2+2) * 2);
    });

    it('half color multiplier', () => {
        hand.addSet(new Pung(true, Tiles.Bamboo2));
        hand.addSet(new Pung(true, Tiles.Bamboo3));
        hand.addSet(new Chow(false, Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], (20+2+2) * 2);
    });

    it('only honour sets multiplier', () => {
        hand.addSet(new Pung(true, Tiles.Bamboo1));
        hand.addSet(new Pung(true, Tiles.Character9));
        hand.addSet(new Kong(true, Tiles.DragonGreen));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], (20+4+4+16) * 2 * 2 * 2);
    });

    it('no honour, same suit multiplier', () => {
        hand.addSet(new Pung(true, Tiles.Character2));
        hand.addSet(new Pung(true, Tiles.Character3));
        hand.addSet(new Pung(true, Tiles.Character4));
        hand.addSet(new Chow(true, Tiles.Character5, Tiles.Character6, Tiles.Character7));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], (20+2+2+2) * 2 * 2 * 2);
    });

    it('Applying round limit cap', () => {
        hand.addSet(new Kong(false, Tiles.Character1));
        hand.addSet(new Kong(false, Tiles.Character9));
        hand.addSet(new Kong(false, Tiles.DragonGreen));
        hand.addSet(new Kong(false, Tiles.DragonWhite));

        round.setHand(game.players[0], hand);
        round.setWinner(game.players[0], false, false);

        scoreHand(round, game.players[0], 1000);
    })
});

