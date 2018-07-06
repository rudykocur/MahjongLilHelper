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

        this.template.clearSlot('rows');

        game.rounds.forEach(round => {
            let balance = round.getRoundBalance();
            let cumulativeBalance = game.getTotalBalance(round.roundIndex);

            let row = this.template.create('row');
            this.template.appendToSlot('rows', row);

            row.fillSlots({
                player1RoundBalance: balance[0],
                player2RoundBalance: balance[1],
                player3RoundBalance: balance[2],
                player4RoundBalance: balance[3],
                player1CumulativeBalance: cumulativeBalance[0],
                player2CumulativeBalance: cumulativeBalance[1],
                player3CumulativeBalance: cumulativeBalance[2],
                player4CumulativeBalance: cumulativeBalance[3],
                roundNumber: round.roundNumber,
                windIndicator: renderTile(round.windIndicator)
            });

            Array.from(row.getRoot().querySelectorAll('[data-action="handEdit"]')).forEach((elem, playerIndex) => {
                if(round.winner && round.winner.seatNumber === playerIndex) {
                    elem.classList.add('winner');
                }

                elem.addEventListener('click', () => {
                    this.onHandEditClick.emit({
                            round: round,
                            player: game.players[playerIndex],
                        });
                });
            })
        });
    }
}