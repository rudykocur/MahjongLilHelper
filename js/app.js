
import {Hand} from './hand.js';
import {Player} from './game.js';
import {HandCreatorView} from "./view/handCreator.js";
import {GameBalanceTableView} from "./view/gameBalance";

import {dependencies} from 'needlepoint';
import {domLoader} from "./view/templates";


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


const UI_MODE = {
    table: 'gameBalance',
    hand: 'handCreator'
};

@dependencies(domLoader('AppTemplate'), HandCreatorView, GameBalanceTableView)
export class MainAppUI {

    /**
     * @param {DomTemplate} template
     * @param {HandCreatorView} handCreator
     * @param {GameBalanceTableView} balanceView
     */
    constructor(template, handCreator, balanceView) {
        this.root = template.getRoot();

        this.handCreator = handCreator;
        this.balanceTable = balanceView;

        this.root.appendChild(this.handCreator.root);
        this.root.appendChild(this.balanceTable.root);

        this.handCreator.initUI();
    }

    setMode(mode) {
        this.root.setAttribute('data-mode', mode);
    }

    mount(parent) {
        parent.appendChild(this.root);
    }
}

@dependencies(MainAppUI)
export class MahjongLilHelperMainViewController {

    /**
     * @param {MainAppUI} view
     */
    constructor(view) {
        this.view = view;

        /**
         * @type {Game}
         */
        this.game = null;

        this.view.balanceTable.onHandEditClick.addListener((/*OnHandEditEvent*/event) => {
            this.view.setMode(UI_MODE.hand);
            this.view.handCreator.show(event.round, event.player);
        });

        this.view.balanceTable.addRoundEvent.addListener(() => {
            this.game.createRound();
            this.view.balanceTable.renderGameBalance(this.game);
        });

        this.view.handCreator.onEditFinish.addListener(this.handleHandEditFinish.bind(this));
    }

    loadState(game) {
        this.view.setMode(UI_MODE.table);

        this.game = game;
        this.view.balanceTable.renderGameBalance(this.game);
    }

    /**
     * @param {OnEditFinishEvent} event
     */
    handleHandEditFinish(event) {
        this.view.setMode(UI_MODE.table);

        let hand = new Hand();
        event.tilesets.forEach(set => hand.addSet(set));

        event.round.setHand(event.player, hand);
        if(event.isWinner) {
            event.round.setWinner(event.player, event.lastAvailableTile, event.lastTileFromWall);
        }

        this.view.balanceTable.renderGameBalance(this.game);
    }
}
