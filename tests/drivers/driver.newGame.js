import {HTMLDriver} from "../utils";

export class NewGameViewDriver extends HTMLDriver {
    constructor(dom) {
        super(dom);
    }

    _getNamesInputs() {
        return Array.from(this.root.querySelectorAll('input'));
    }

    fillPlayer(playerIndex, playerName) {
        this._getNamesInputs()[playerIndex].value = playerName;
    }

    getPlayerNames() {
        return this._getNamesInputs().map(input => input.value);
    }

    clickAdd() {
        this.click('[name=submit]');
    }

    clickCancel() {
        this.click('[name=cancel]')
    }
}