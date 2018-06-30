
import {Hand} from './hand.js';
import {Player, Game} from './game.js';
import {HandCreatorView} from "./view/handCreator.js";
import {EventEmitter} from "./utils.js";


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


class MahjongLilHelperMainViewController {
    constructor(root) {
        this.root = root;

        this.balanceTable = new GameBalanceTableView(this.root);
        this.handCreator = new HandCreatorView(this.root);

        this.handCreator.initUI();

        this.game = null;

        this.balanceTable.onHandEditClick.addListener((round, player) => {
            this.setUIMode('handCreator');
            this.handCreator.show(round, player);
        });

        this.handCreator.onEditFinish.addListener((/*OnEditFinishEvent*/ event) => {

            console.log('EVENT', event);

            this.setUIMode('gameBalance');
            let hand = new Hand();
            event.tilesets.forEach(set => hand.addSet(set));

            event.round.setHand(event.player, hand);
            if(event.isWinner) {
                event.round.setWinner(event.player, event.lastAvailableTile, event.lastTileFromWall);
            }

            this.balanceTable.renderGameBalance(this.game);
        })
    }

    setUIMode(mode) {
        this.root.setAttribute('data-mode', mode);
    }

    loadState(game) {
        this.setUIMode('gameBalance');

        this.game = game;
        this.balanceTable.renderGameBalance(this.game);
    }
}

class GameBalanceTableView {
    constructor(root) {
        this.table = root.querySelector('table');

        this.onHandEditClick = new EventEmitter();

        this._createdRows = [];
    }

    /**
     *
     * @param {Game} game
     */
    renderGameBalance(game) {
        this._createdRows.forEach(row => row.parentNode.removeChild(row));
        this._createdRows = [];

        game.rounds.forEach(round => {
            let balance = round.getRoundBalance();
            let cumulativeBalance = game.getTotalBalance(round.roundIndex);

            let row = this.table.insertRow();
            this._createdRows.push(row);

            row.insertCell().appendChild(document.createTextNode(round.roundNumber));

            let roundCells = this._renderBalance(row, balance);
            this._renderBalance(row, cumulativeBalance);

            roundCells.forEach((cell, index) => {
                cell.addEventListener('click', () => {
                    this.onHandEditClick.emit(round, game.players[index]);
                })
            })
        });
    }

    _renderBalance(row, balance) {
        // let cells = [];

        return balance.map(bal => {
            let cell = row.insertCell();
            cell.appendChild(document.createTextNode(bal));
            return cell;
        });
    }

    renderSummaryRow(game) {
        let balance = game.getTotalBalance();

        let foot = this.table.createTFoot();

        console.log(foot);

        let row = foot.insertRow();

        row.insertCell().appendChild(document.createTextNode('łącznie'));
        this._renderBalance(row, balance);
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

    let ctrl = new MahjongLilHelperMainViewController(document.getElementById('mahjongContent'));

    ctrl.loadState(game);

    console.log('READY', ctrl);
});