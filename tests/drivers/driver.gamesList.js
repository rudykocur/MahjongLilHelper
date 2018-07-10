import {HTMLDriver, normalize} from "../utils";

export class GamesListViewDriver extends HTMLDriver {
    constructor(dom) {
        super(dom);
    }

    _getGamesRows() {
        return Array.from(this.root.querySelectorAll('.gamesList > div'));
    }

    getGameTitles() {
        return this._getGamesRows().map(node => Array.from(node.querySelectorAll('div')).map(
            div => normalize(div.textContent)
        ));
    }

    clickGame(gameIndex) {
        this.click(this._getGamesRows()[gameIndex]);
    }

    clickNewGame() {
        this.click('button');
    }
}