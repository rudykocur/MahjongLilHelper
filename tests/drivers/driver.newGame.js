import {HTMLDriver} from "../utils";

export class NewGameViewDriver extends HTMLDriver {
    constructor(dom) {
        super(dom);
    }

    fillPlayer(playerIndex, playerName) {
        Array.from(this.root.querySelectorAll('input'))[playerIndex].value = playerName;
    }

    clickAdd() {
        this.click('[name=submit]');
    }

    clickCancel() {
        this.click('[name=cancel]')
    }
}