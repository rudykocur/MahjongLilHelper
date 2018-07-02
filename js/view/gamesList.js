import {EventEmitter} from "../utils";
import {domLoader} from "./templates";
import {dependencies} from "needlepoint";
import {GamePanel} from "./gamePanel";


@dependencies(domLoader('GamesListTemplate'))
export class GamesListView extends GamePanel{

    /**
     * @param {DomTemplate} template
     */
    constructor(template) {
        super(template.getRoot());

        this.gameSelectedEvent = new EventEmitter();
        this.newGameEvent = new EventEmitter();

        this.gamesList = this.root.querySelector('ul');

        this.root.querySelector('button').addEventListener('click', () => {
            this.newGameEvent.emit();
        })
    }

    /**
     *
     * @param {Array<Game>} gamesList
     */
    loadGames(gamesList) {
        while(this.gamesList.firstChild) {
            this.gamesList.removeChild(this.gamesList.firstChild);
        }

        gamesList.forEach(game => {
            let row = document.createElement('li');
            row.textContent = this._getGameLabel(game);

            row.addEventListener('click', () => {
                this.gameSelectedEvent.emit(game);
            });

            this.gamesList.appendChild(row);
        })
    }

    /**
     * @param {Game} game
     */
    _getGameLabel(game) {
        return `Runda ${game.rounds.length}: `+
            `${game.players[0].name}, ${game.players[1].name}, ${game.players[2].name}, ${game.players[3].name}`;
    }
}