import {HTMLDriver} from "../utils";

export class GameBalanceViewDriver extends HTMLDriver {
    constructor(dom) {
        super(dom);

        this.table = this.root.querySelector('table');
    }

    getPlayerNames() {
        let headTrs = this.table.querySelectorAll('thead tr');

        let names = [];

        Array.from(headTrs[1].querySelectorAll('th')).slice(1).forEach(nameCell => {
            let name = nameCell.textContent.trim();
            if(names.indexOf(name) < 0) {
                names.push(name);
            }
        });

        return names;
    }

    getValuesForRound(roundNumber) {
        let roundRows = Array.from(this.table.querySelectorAll('tbody tr'));

        return Array.from(roundRows[roundNumber].querySelectorAll('td')).slice(1).map(cell => {
            return parseInt(cell.textContent);
        });
    }

    getRoundsCount() {
        return this.table.querySelectorAll('tbody tr').length;
    }

    /**
     * @param {Round} round
     * @param {Player} player
     */
    clickPlayerInRound(round, player) {
        let roundRows = this.table.querySelectorAll('tbody tr');

        let roundRow = roundRows[round.roundIndex];

        let cell = Array.from(roundRow.querySelectorAll('td')).slice(1)[player.seatNumber];

        this.click(cell);
    }

    clickAddRoundButton() {
        this.click(this.root.querySelector('[data-action="addRound"]'));
    }

    clickBackToGameList() {
        this.click(this.root.querySelector('a'));
    }
}