import {HTMLDriver} from "../utils";

const path = require('path');

export class GameBalanceViewDriver extends HTMLDriver {
    constructor(dom) {
        super(dom);

        this.table = this.root.querySelector('table');
    }

    _getRowRounds() {
        return Array.from(this.table.querySelectorAll('tbody tr'))
    }

    /**
     * @param {Round} round
     * @return {HTMLElement}
     */
    _getRoundRow(round) {
        return this._getRowRounds()[round.roundIndex];
    }

    getPlayerNames() {
        let headTrs = this.table.querySelectorAll('thead tr');

        let names = [];

        Array.from(headTrs[1].querySelectorAll('th')).slice(2).forEach(nameCell => {
            let name = nameCell.textContent.trim();
            if(names.indexOf(name) < 0) {
                names.push(name);
            }
        });

        return names;
    }

    getValuesForRound(roundNumber) {
        let roundRows = this._getRowRounds();

        return Array.from(roundRows[roundNumber].querySelectorAll('td')).slice(2).map(cell => {
            return parseInt(cell.textContent);
        });
    }

    getRoundsCount() {
        return this._getRowRounds().length;
    }

    /**
     * @param {Round} round
     * @param {Player} player
     */
    clickPlayerInRound(round, player) {

        let roundRow = this._getRoundRow(round);

        let cell = Array.from(roundRow.querySelectorAll('td')).slice(2)[player.seatNumber];

        this.click(cell);
    }

    getWinnerPlayerIndex(round) {
        let roundRow = this._getRoundRow(round);

        let winnerRow = roundRow.querySelector('.winner');
        let allRows = Array.from(roundRow.querySelectorAll('td')).slice(2, 6);

        if(typeof winnerRow !== 'undefined') {
            return allRows.indexOf(winnerRow);
        }
    }

    getRoundWindTypeString(round) {
        let roundRow = this._getRoundRow(round);
        let windIndicator = roundRow.querySelector('img');

        return path.basename(windIndicator.src, '.png');
    }

    clickAddRoundButton() {
        this.click(this.root.querySelector('[data-action="addRound"]'));
    }

    clickBackToGameList() {
        this.click(this.root.querySelector('a'));
    }
}