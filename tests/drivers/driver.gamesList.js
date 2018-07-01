import {HTMLDriver} from "../utils";

export class GamesListViewDriver extends HTMLDriver {
    constructor(dom) {
        super(dom);
    }

    getGameTitles() {
        return Array.from(this.root.querySelectorAll('li')).map(node => node.textContent);
    }
}