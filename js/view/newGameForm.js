import {EventEmitter} from "../utils";
import {domLoader} from "./templates";
import {dependencies} from "needlepoint";
import {GamePanel} from "./gamePanel";
import {Player} from "../game";


@dependencies(domLoader('NewGameTemplate'))
export class NewGameFormView extends GamePanel {

    /**
     * @param {DomTemplate} template
     */
    constructor(template) {
        super(template.getRoot());

        this.newGameCreateEvent = new EventEmitter();
        this.cancelEvent = new EventEmitter();

        this.form = this.root.querySelector('form');

        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.newGameCreateEvent.emit(this._getPlayers());
        });

        this.form.elements.cancel.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            this.cancelEvent.emit();
        })
    }

    _getPlayers() {
        return [
            new Player(0, this.form.elements.player1Name.value),
            new Player(1, this.form.elements.player2Name.value),
            new Player(2, this.form.elements.player3Name.value),
            new Player(3, this.form.elements.player4Name.value),
        ]
    }
}