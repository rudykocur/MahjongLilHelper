import {EventEmitter} from "../utils";
import {domLoader} from "./templates";
import {dependencies} from "needlepoint";
import {GamePanel} from "./gamePanel";


@dependencies(domLoader('gamesList'))
export class GamesListView extends GamePanel{

    /**
     * @param {DomTemplate} template
     */
    constructor(template) {
        super(template.getRoot());

        this.template = template;

        this.gameSelectedEvent = new EventEmitter();
        this.newGameEvent = new EventEmitter();

        this.root.querySelector('button').addEventListener('click', () => {
            this.newGameEvent.emit();
        })
    }

    /**
     *
     * @param {Array<Game>} gamesList
     */
    loadGames(gamesList) {
        this.template.clearSlot('games');

        gamesList.forEach(game => {

            let balance = game.getTotalBalance();

            let gameRow = this.template.create('gameRow');
            gameRow.fillSlots({
                roundNumber: game.rounds.length,
                player1Name: game.players[0].name,
                player2Name: game.players[1].name,
                player3Name: game.players[2].name,
                player4Name: game.players[3].name,
                player1Score: balance[0],
                player2Score: balance[1],
                player3Score: balance[2],
                player4Score: balance[3],
            });

            this.template.appendToSlot('games', gameRow);

            gameRow.getRoot().addEventListener('click', () => {
                this.gameSelectedEvent.emit(game);
            })
        })
    }

    /**
     * @param {Game} game
     */
    _getGameLabel(game) {
        let balance = game.getTotalBalance();

        return `Runda ${game.rounds.length}: 
            ${game.players[0].name} (${balance[0]}), 
            ${game.players[1].name} (${balance[1]}), 
            ${game.players[2].name} (${balance[2]}), 
            ${game.players[3].name} (${balance[3]})`.replace(/\s+/g, ' ');
    }
}