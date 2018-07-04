import {DomTemplate} from "../js/view/templates";

const mochaJsdom = require('mocha-jsdom');
import {Hand, Tiles} from "../js/hand";
import {Player, Game} from "../js/game";

const jsdom = require("jsdom");
const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').use(require('sinon-chai'));

import {loadTemplateHtml} from "./utils";

import {GameBalanceTableView} from "../js/view/gameBalance";
import {GameBalanceViewDriver} from "./drivers/driver.gameBalance";

/**
 * @param {OnEditFinishEvent} event
 * @return {Hand}
 */
function getHand(event) {
    let hand = new Hand();
    event.tilesets.forEach(set => hand.addSet(set));
    return hand;
}

function createGame() {
    return new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4'));
}

/**
 *
 * @param {GameBalanceViewDriver} driver
 * @param {Game} game
 * @param {Round} round
 */
function assertRoundValues(driver, game, round) {
    let roundBalance = round.getRoundBalance();
    let gameBalance = game.getTotalBalance(round.roundIndex);

    let expectedValues = [roundBalance[0], roundBalance[1], roundBalance[2], roundBalance[3],
        gameBalance[0], gameBalance[1], gameBalance[2], gameBalance[3]];

    expect(driver.getValuesForRound(round.roundIndex)).to.be.deep.equal(expectedValues);
}

describe('DOM: game balance table tests', () => {

    mochaJsdom();
    let /*Game*/game, /*Round*/round0, /*Round*/round1, /*Round*/round2, player, /*GameBalanceViewDriver*/driver;

    beforeEach(() => {
        game = createGame();
        round0 = game.createRound();
        round0.setWinner(game.players[0], false, false);
        round0.roundScores = [100, 30, 50, 10];

        round1 = game.createRound();
        round2 = game.createRound();
        player = game.players[0];

        return loadTemplateHtml('gameBalance.html').then((dom) => {
            driver = new GameBalanceViewDriver(dom);
        })
    });

    /**
     * @return {GameBalanceTableView}
     */
    function initDefaultView() {
        let view = new GameBalanceTableView(new DomTemplate(driver.root));

        view.renderGameBalance(game);

        return view;
    }

    describe('Basic tests', () => {
        it('rendering rows for each round', () => {
            let view = initDefaultView();

            expect(driver.getRoundsCount()).to.be.equal(3);
        });

        it('rendering player names in headers', () => {
            let view = initDefaultView();

            let expectedNames = [
                game.players[0].name,
                game.players[1].name,
                game.players[2].name,
                game.players[3].name,
            ];

            expect(driver.getPlayerNames()).to.be.deep.equal(expectedNames);
        });

        it('valid values for first round balance', () => {
            let view = initDefaultView();

            assertRoundValues(driver, game, round0);
            assertRoundValues(driver, game, round1);
            assertRoundValues(driver, game, round2);
        });

        it('values in row updates after round update', () => {
            let view = initDefaultView();

            assertRoundValues(driver, game, round1);

            round1.setWinner(game.players[1], false, false);
            round1.roundScores = [100, 30, 50, 10];
            view.renderGameBalance(game);

            assertRoundValues(driver, game, round1);
        });

        it('highlighting round winner', () => {
            let view = initDefaultView();
            round1.setWinner(game.players[1], false, false);
            round1.roundScores = [100, 30, 50, 10];
            view.renderGameBalance(game);

            expect(driver.getWinnerPlayerIndex(round1)).to.be.equal(1);
        });

        it('showing round winds', () => {
            let view = initDefaultView();
            let round3 = game.createRound();
            let round4 = game.createRound();
            view.renderGameBalance(game);

            expect(driver.getRoundWindTypeString(round1)).to.be.equal(Tiles.WindEast.toTypeString());
            expect(driver.getRoundWindTypeString(round3)).to.be.equal(Tiles.WindEast.toTypeString());
            expect(driver.getRoundWindTypeString(round4)).to.be.equal(Tiles.WindSouth.toTypeString());
        });

        it('triggering onHandEditClick event', (done) => {
            let view = initDefaultView();

            view.onHandEditClick.addListener((/*OnHandEditEvent*/event) => {
                expect(event.round.roundIndex).to.be.equal(round1.roundIndex);
                expect(event.player.seatNumber).to.be.equal(game.players[2].seatNumber);
                done();
            });

            driver.clickPlayerInRound(round1, game.players[2]);
        });

        it('triggering addRoundEvent', (done) => {
            let view = initDefaultView();

            view.addRoundEvent.addListener(() => {
                done();
            });

            driver.clickAddRoundButton();
        });

        it('triggering returnToGameListEvent', () => {
            let view = initDefaultView();

            let callback = sinon.spy();

            view.returnToGameListEvent.addListener(callback);

            driver.clickBackToGameList();

            expect(callback).calledOnce;
        })
    })
});