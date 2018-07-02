import {EventEmitter} from "../utils";
import {domLoader} from "./templates";
import {dependencies} from "needlepoint";
import {GamePanel} from "./gamePanel";


@dependencies(domLoader('gameBalance'))
export class GameBalanceTableView extends GamePanel{

    /**
     * @param {DomTemplate} template
     */
    constructor(template) {
        super(template.getRoot());

        this.template = template;
        this.table = template.getRoot();
        this.tbody = this.table.querySelector('tbody');

        this.onHandEditClick = new EventEmitter();
        this.addRoundEvent = new EventEmitter();

        this._createdRows = [];

        this.root.querySelector('[data-action="addRound"]').addEventListener('click', () => {
            this.addRoundEvent.emit();
        })
    }

    /**
     * @param {Game} game
     */
    renderGameBalance(game) {
        this.template.fillSlots({
            player1Name: game.players[0].name,
            player2Name: game.players[1].name,
            player3Name: game.players[2].name,
            player4Name: game.players[3].name,
        });

        this._createdRows.forEach(row => row.parentNode.removeChild(row));
        this._createdRows = [];

        game.rounds.forEach(round => {
            let balance = round.getRoundBalance();
            let cumulativeBalance = game.getTotalBalance(round.roundIndex);

            let row = this.table.insertRow();
            this.tbody.appendChild(row);
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
}