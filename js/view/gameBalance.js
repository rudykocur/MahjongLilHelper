import {EventEmitter} from "../utils";
import {domLoader} from "./templates";
import {dependencies} from "needlepoint";


@dependencies(domLoader('GameBalanceTemplate'))
export class GameBalanceTableView {

    /**
     * @param {DomTemplate} template
     */
    constructor(template) {
        this.table = this.root = template.clone();

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
                    this.onHandEditClick.emit({
                        round: round,
                        player: game.players[index],
                    });
                })
            })
        });
    }

    _renderBalance(row, balance) {
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