// const h = require('./hand');
// const g = require('./game');
import * as h from './hand.mjs';
import * as g from './game.mjs';

function createGame() {
    return new g.Game(new g.Player(0, 'P1'), new g.Player(1, 'P2'), new g.Player(2, 'P3'), new g.Player(3, 'P4'));
}

describe('round arrangements', () => {
    it('game first round', () => {
        let game = createGame();

        let round1 = game.createRound();

        chai.expect(round1.roundNumber).to.equal(1);
        chai.expect(round1.eastWindPlayer).to.equal(game.players[0]);
        chai.expect(round1.windIndicator).to.equal(h.Tiles.WindEast);
    });

    it('game second round', () => {
        let game = createGame();

        game.createRound();
        let round2 = game.createRound();

        chai.expect(round2.roundNumber).to.equal(2);
        chai.expect(round2.eastWindPlayer).to.equal(game.players[1]);
        chai.expect(round2.windIndicator).to.equal(h.Tiles.WindEast);
    });

    it('game fifth round', () => {
        let game = createGame();

        game.createRound();
        game.createRound();
        game.createRound();
        game.createRound();
        let round5 = game.createRound();

        chai.expect(round5.roundNumber).to.equal(5);
        chai.expect(round5.eastWindPlayer).to.equal(game.players[0]);
        chai.expect(round5.windIndicator).to.equal(h.Tiles.WindSouth);
    });

    function testRoundWinds(game, wind1, wind2, wind3, wind4) {
        let round = game.createRound();

        chai.expect(round.getPlayerWind(game.players[0])).to.equal(wind1);
        chai.expect(round.getPlayerWind(game.players[1])).to.equal(wind2);
        chai.expect(round.getPlayerWind(game.players[2])).to.equal(wind3);
        chai.expect(round.getPlayerWind(game.players[3])).to.equal(wind4);
    }

    it('player winds', () => {
        let game = createGame();

        testRoundWinds(game, h.Tiles.WindEast, h.Tiles.WindSouth, h.Tiles.WindWest, h.Tiles.WindNorth);
        testRoundWinds(game, h.Tiles.WindNorth, h.Tiles.WindEast, h.Tiles.WindSouth, h.Tiles.WindWest);
        testRoundWinds(game, h.Tiles.WindWest, h.Tiles.WindNorth, h.Tiles.WindEast, h.Tiles.WindSouth);
        testRoundWinds(game, h.Tiles.WindSouth, h.Tiles.WindWest, h.Tiles.WindNorth, h.Tiles.WindEast);

        testRoundWinds(game, h.Tiles.WindEast, h.Tiles.WindSouth, h.Tiles.WindWest, h.Tiles.WindNorth);
        testRoundWinds(game, h.Tiles.WindNorth, h.Tiles.WindEast, h.Tiles.WindSouth, h.Tiles.WindWest);
        testRoundWinds(game, h.Tiles.WindWest, h.Tiles.WindNorth, h.Tiles.WindEast, h.Tiles.WindSouth);
        testRoundWinds(game, h.Tiles.WindSouth, h.Tiles.WindWest, h.Tiles.WindNorth, h.Tiles.WindEast);

        testRoundWinds(game, h.Tiles.WindEast, h.Tiles.WindSouth, h.Tiles.WindWest, h.Tiles.WindNorth);
        testRoundWinds(game, h.Tiles.WindNorth, h.Tiles.WindEast, h.Tiles.WindSouth, h.Tiles.WindWest);
        testRoundWinds(game, h.Tiles.WindWest, h.Tiles.WindNorth, h.Tiles.WindEast, h.Tiles.WindSouth);
        testRoundWinds(game, h.Tiles.WindSouth, h.Tiles.WindWest, h.Tiles.WindNorth, h.Tiles.WindEast);

        testRoundWinds(game, h.Tiles.WindEast, h.Tiles.WindSouth, h.Tiles.WindWest, h.Tiles.WindNorth);
        testRoundWinds(game, h.Tiles.WindNorth, h.Tiles.WindEast, h.Tiles.WindSouth, h.Tiles.WindWest);
        testRoundWinds(game, h.Tiles.WindWest, h.Tiles.WindNorth, h.Tiles.WindEast, h.Tiles.WindSouth);
    });
});

describe('round balance calculations', function () {

    let game, round, calc;

    beforeEach(() => {
        game = createGame();

        round = game.createRound();

        calc = new g.RoundBalanceCalculator();
    });

    it('calculations on round 1, winner p[0]', () => {
        round.setWinner(game.players[0], false, false);
        let balance = calc.getBalance(round, game.players, [300, 20, 10, 0]);

        chai.expect(balance).to.deep.equal([1800, -570, -600, -630])
    });

    it('calculations on round 2, winner p[2]', () => {
        let round2 = game.createRound();
        round2.setWinner(game.players[2], false, false);
        let balance = calc.getBalance(round2, game.players, [150, 300, 20, 10]);

        chai.expect(balance).to.deep.equal([-180, 840, 80, -740])
    });

    it('calculations on round 3, winner p[1]', () => {
        game.createRound();
        let round3 = game.createRound();
        round3.setWinner(game.players[1], false, false);
        let balance = calc.getBalance(round3, game.players, [150, 300, 20, 10]);

        chai.expect(balance).to.deep.equal([100, 1200, -840, -460])
    });

    it('calculations on round 3, winner p[2]', () => {
        game.createRound();
        let round3 = game.createRound();
        round3.setWinner(game.players[2], false, false);
        let balance = calc.getBalance(round3, game.players, [150, 300, 20, 10]);

        chai.expect(balance).to.deep.equal([-150-40+140, 150-40+290, 6*20, -140-290-40])
    });

    it('calculation of global total balance', () => {
        round.setWinner(game.players[0], false, false);
        round.roundScores = [300, 20, 10, 0];

        let round2 = game.createRound();
        round2.setWinner(game.players[2], false, false);
        round2.roundScores = [150, 300, 20, 10];

        let round3 = game.createRound();
        round3.setWinner(game.players[2], false, false);
        round3.roundScores = [150, 300, 20, 10];

        chai.expect(game.getTotalBalance()).to.deep.equal([
            1800-180+(-150-40+140),
            -570+840+(150-40+290),
            -600+80+(6*20),
            -630-740+(-140-290-40)]);
    });
});

