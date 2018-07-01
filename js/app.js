
import {Hand} from './hand.js';
import {Player, Game} from './game.js';
import {HandCreatorView} from "./view/handCreator.js";
import {GameBalanceTableView} from "./view/gameBalance";

import {dependencies, container} from 'needlepoint';
import {TemplateContainer, domLoader} from "./view/templates";


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
class MainAppUI {

    /**
     * @param {DomTemplate} template
     * @param {HandCreatorView} handCreator
     * @param {GameBalanceTableView} balanceView
     */
    constructor(template, handCreator, balanceView) {
        this.root = template.clone();

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
class MahjongLilHelperMainViewController {

    /**
     * @param {MainAppUI} view
     */
    constructor(view) {
        this.view = view;

        this.game = null;

        this.view.balanceTable.onHandEditClick.addListener((/*OnHandEditEvent*/event) => {
            this.view.setMode(UI_MODE.hand);
            this.view.handCreator.show(event.round, event.player);
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


document.addEventListener("DOMContentLoaded", function(event) {
    let players = [
        new Player(0, "Grzesiek"),
        new Player(1, "Wojtek"),
        new Player(2, "Gosia"),
        new Player(3, "Ola"),
    ];
    let game = new Game(players[0], players[1], players[2], players[3]);

    let round1 = game.createRound();
    // round1.roundScores = [100, 200, 300, 400];

    let round2 = game.createRound();
    // round2.roundScores = [200, 100, 50, 10];

    let round3 = game.createRound();

    let tmpl = container.resolve(TemplateContainer);
    tmpl.discover(document.body);

    let ctrl = container.resolve(MahjongLilHelperMainViewController);

    ctrl.view.mount(document.getElementById('mahjongContent'));

    ctrl.loadState(game);

    console.log('READY', ctrl);
});