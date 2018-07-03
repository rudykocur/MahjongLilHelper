import {DomTemplate} from "../js/view/templates";

const mochaJsdom = require('mocha-jsdom');
import {Player, Game} from "../js/game";

const jsdom = require("jsdom");
const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').use(require('sinon-chai'));

import {loadTemplateHtml} from "./utils";

import {GamesListView} from "../js/view/gamesList";
import {GamesListViewDriver} from "./drivers/driver.gamesList";

describe('DOM: games list', () => {

    mochaJsdom();
    let /*GamesListViewDriver*/driver, /*DomTemplate*/tmpl;

    beforeEach(() => {
        return loadTemplateHtml('gamesList.html').then((dom) => {
            driver = new GamesListViewDriver(dom);
            tmpl = new DomTemplate(driver.root);
        })
    });

    /**
     * @return {GamesListView}
     */
    function initDefaultView() {
        let view = new GamesListView(tmpl);

        return view;
    }

    /**
     * @return {Array<Game>}
     */
    function createGames() {
        return [
            new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4')),
            new Game(new Player(0, 'P3'), new Player(1, 'P1'), new Player(2, 'P4'), new Player(3, 'P2')),
            new Game(new Player(0, 'Rudy'), new Player(1, 'Wojtas'), new Player(2, 'Gohcia'), new Player(3, 'Zxully')),
        ];
    }

    it('Listing available games', () => {
        let view = initDefaultView();

        let games = createGames();

        let round1 = games[1].createRound();
        let round2 = games[1].createRound();

        round1.setWinner(games[1].players[2], false, false);
        round1.roundScores = [20, 100, 30, 40];

        games[0].createRound();
        games[0].createRound();
        games[0].createRound();
        games[0].createRound();

        view.loadGames(games);

        expect(driver.getGameTitles()).to.be.eql([
            'Runda 4: P1 (0), P2 (0), P3 (0), P4 (0)',
            'Runda 2: P3 (-260), P1 (190), P4 (120), P2 (-50)',
            'Runda 0: Rudy (0), Wojtas (0), Gohcia (0), Zxully (0)',
        ])
    });

    it('Clicking game triggers gameSelectedEvent', () => {
        let view = initDefaultView();
        let games = createGames();

        view.loadGames(games);

        let callback = sinon.fake();

        view.gameSelectedEvent.addListener(callback);

        driver.clickGame(1);

        expect(callback).calledWithExactly(games[1]);
    });

    it('Clicking button triggers newGameEvent', () => {
        let view = initDefaultView();
        let games = createGames();

        view.loadGames(games);

        let callback = sinon.fake();

        view.newGameEvent.addListener(callback);

        driver.clickNewGame();

        expect(callback).calledWithExactly();
    });
});