import {DomTemplate} from "../js/view/templates";

const mochaJsdom = require('mocha-jsdom');
import {Player, Game} from "../js/game";

const jsdom = require("jsdom");
const expect = require('chai').expect;

import {loadTestHtml} from "./utils";

import {GamesListView} from "../js/view/gamesList";
import {GamesListViewDriver} from "./drivers/driver.gamesList";

describe('DOM: games list', () => {

    mochaJsdom();
    let /*GamesListViewDriver*/driver;

    beforeEach(() => {
        return loadTestHtml('gamesList.html').then((dom) => {
            driver = new GamesListViewDriver(dom);
        })
    });

    /**
     * @return {GamesListView}
     */
    function initDefaultView() {
        let view = new GamesListView(new DomTemplate(driver.root));

        return view;
    }

    it('Basic tests', () => {
        let view = initDefaultView();

        let games = [
            new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4')),
            new Game(new Player(0, 'P3'), new Player(1, 'P1'), new Player(2, 'P4'), new Player(3, 'P2')),
            new Game(new Player(0, 'Rudy'), new Player(1, 'Wojtas'), new Player(2, 'Gohcia'), new Player(3, 'Zxully')),
        ];

        view.loadGames(games);

        expect(driver.getGameTitles()).to.be.eql(['test', 'aa'])
    })
});