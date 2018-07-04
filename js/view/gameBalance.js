import {EventEmitter} from "../utils";
import {domLoader} from "./templates";
import {dependencies} from "needlepoint";
import {GamePanel} from "./gamePanel";
import {renderTile} from "./utils";


@dependencies(domLoader('gameBalance'))
export class GameBalanceTableView extends GamePanel{

    /**
     * @param {DomTemplate} template
     */
    constructor(template) {
        super(template.getRoot());

        this.template = template;
        this.table = this.root.querySelector('table');
        this.tbody = this.table.querySelector('tbody');

        this.onHandEditClick = new EventEmitter();
        this.addRoundEvent = new EventEmitter();
        this.returnToGameListEvent = new EventEmitter();

        this._createdRows = [];

        this.root.querySelector('[data-action="addRound"]').addEventListener('click', () => {
            this.addRoundEvent.emit();
        });

        this.root.querySelector('a').addEventListener('click', e => {
            e.preventDefault();
            this.returnToGameListEvent.emit();
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
            let row2 = this.table.insertRow();
            this.tbody.appendChild(row);
            this.tbody.appendChild(row2);

            this._createdRows.push(row);
            this._createdRows.push(row2);

            let roundCell = row.insertCell();
            let windCell = row.insertCell();

            roundCell.rowSpan = 2;
            windCell.rowSpan = 2;

            roundCell.appendChild(document.createTextNode(round.roundNumber));
            windCell.appendChild(renderTile(round.windIndicator));

            let roundCells = this._renderBalance(row, balance);
            this._renderBalance(row2, cumulativeBalance);

            roundCells.forEach((cell, index) => {

                if(round.winner && round.winner.seatNumber === index) {
                    cell.classList.add('winner');
                }

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