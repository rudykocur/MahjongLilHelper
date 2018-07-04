
import {Hand} from './hand.js';
import {Player, Game} from './game.js';
import {HandCreatorView} from "./view/handCreator.js";
import {GameBalanceTableView} from "./view/gameBalance";

import {dependencies} from 'needlepoint';
import {domLoader} from "./view/templates";
import {GamesListView} from "./view/gamesList";
import {NewGameFormView} from "./view/newGameForm";
import {MahjongDatabase} from "./db";


/**
 * @typedef {Object} OnEditFinishEvent
 * @property {Round} round
 * @property {Player} player
 * @property {Array<TileSet>} tilesets
 * @property {boolean} isWinner
 * @property {boolean} lastTileFromWall
 * @property {boolean} lastAvailableTile
 * @property {boolean} lastTileSpecial
 */

/**
 * @typedef {Object} OnHandEditEvent
 * @property {Round} round
 * @property {Player} player
 */


@dependencies(domLoader('app'), HandCreatorView, GameBalanceTableView, GamesListView, NewGameFormView)
export class MainAppUI {

    /**
     * @param {DomTemplate} template
     * @param {HandCreatorView} handCreator
     * @param {GameBalanceTableView} balanceView
     * @param {GamesListView} gameList
     * @param {NewGameFormView} newGameForm
     */
    constructor(template, handCreator, balanceView, gameList, newGameForm) {
        this.root = template.getRoot();

        this.handCreator = handCreator;
        this.balanceTable = balanceView;
        this.gameList = gameList;
        this.newGameForm = newGameForm;

        this.panels = [this.handCreator, this.balanceTable, this.gameList, this.newGameForm];
        /**
         *
         * @type {GamePanel}
         */
        this.activePanel = null;

        this.panels.forEach(panel => {
            this.root.appendChild(panel.getRoot());
            panel.hide();
        });

        this.handCreator.initUI();
    }

    showPanel(panel) {
        if(this.activePanel) {
            this.activePanel.hide();
        }

        this.activePanel = panel;

        this.activePanel.show();
    }

    mount(parent) {
        parent.appendChild(this.root);
    }
}

@dependencies(MainAppUI, MahjongDatabase)
export class MahjongLilHelperMainViewController {

    /**
     * @param {MainAppUI} view
     * @param {MahjongDatabase} db
     */
    constructor(view, db) {
        this.view = view;
        this.db = db;

        /**
         * @type {Game}
         */
        this.currentGame = null;

        /**
         * @type {Array<Game>}
         */
        this.games = [];

        this.view.gameList.gameSelectedEvent.addListener(game => {
            this.loadGame(game);
        });

        this.view.gameList.newGameEvent.addListener(() => this.view.showPanel(this.view.newGameForm));

        this.view.newGameForm.cancelEvent.addListener(() => this.view.showPanel(this.view.gameList));

        this.view.newGameForm.newGameCreateEvent.addListener(players => this.addNewGame(players));

        this.view.balanceTable.onHandEditClick.addListener((/*OnHandEditEvent*/event) => {
            this.view.showPanel(this.view.handCreator);

            this.view.handCreator.showHand(event.round, event.player);
        });

        this.view.balanceTable.addRoundEvent.addListener(() => {
            this.currentGame.createRound();
            this.save();
            this.view.balanceTable.renderGameBalance(this.currentGame);
        });

        this.view.balanceTable.returnToGameListEvent.addListener(() => {
            this.view.gameList.loadGames(this.games);

            this.view.showPanel(this.view.gameList);
        });

        this.view.handCreator.onEditFinish.addListener(this.handleHandEditFinish.bind(this));
    }

    loadState(games) {
        this.view.showPanel(this.view.gameList);

        this.games = games;
        this.view.gameList.loadGames(this.games);
    }

    loadGame(game) {
        this.view.showPanel(this.view.balanceTable);
        this.currentGame = game;
        this.view.balanceTable.renderGameBalance(this.currentGame);
    }

    load() {
        this.loadState(this.db.load());
    }

    save() {
        this.db.save(this.games);
    }

    addNewGame(players) {
        this.games.push(new Game(...players));

        this.save();

        this.view.showPanel(this.view.gameList);

        this.view.gameList.loadGames(this.games);
    }

    /**
     * @param {OnEditFinishEvent} event
     */
    handleHandEditFinish(event) {
        this.view.showPanel(this.view.balanceTable);

        let hand = new Hand();
        event.tilesets.forEach(set => hand.addSet(set));

        event.round.setHand(event.player, hand);
        if(event.isWinner) {
            event.round.setWinner(event.player, event.lastAvailableTile, event.lastTileFromWall);
        }

        this.save();

        this.view.balanceTable.renderGameBalance(this.currentGame);
    }
}
