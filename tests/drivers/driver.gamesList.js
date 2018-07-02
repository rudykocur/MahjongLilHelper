import {HTMLDriver} from "../utils";

export class GamesListViewDriver extends HTMLDriver {
    constructor(dom) {
        super(dom);
    }

    _getGamesRows() {
        return Array.from(this.root.querySelectorAll('li'));
    }

    getGameTitles() {
        return this._getGamesRows().map(node => node.textContent);
    }

    clickGame(gameIndex) {
        this.click(this._getGamesRows()[gameIndex]);
    }

    clickNewGame() {
        this.click('button');
    }
}