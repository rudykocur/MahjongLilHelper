import {HTMLDriver} from "../utils";

const path = require('path');

let zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));

export class GameBalanceViewDriver extends HTMLDriver {
    constructor(dom) {
        super(dom);

        this.table = this.root.querySelector('table');
    }

    _getRoundRows(oddRows) {
        let sel;
        if(oddRows) {
            sel = 'tbody tr:nth-child(2n)'
        }
        else {
            sel = 'tbody tr:nth-child(2n-1)'
        }

        return Array.from(this.table.querySelectorAll(sel))
    }

    /**
     * @param {Round} round
     * @return {HTMLElement}
     */
    _getRoundRow(round) {
        return this._getRoundRows()[round.roundIndex];
    }

    getPlayerNames() {
        let headTr = this.table.querySelector('thead tr');

        let names = [];

        Array.from(headTr.querySelectorAll('th')).slice(2).forEach(nameCell => {
            let name = nameCell.textContent.trim();
            if(names.indexOf(name) < 0) {
                names.push(name);
            }
        });

        return names;
    }

    getValuesForRound(roundNumber) {
        let firstRow = this._getRoundRows()[roundNumber];
        let otherRow = this._getRoundRows(true)[roundNumber];

        let cells = Array.from(firstRow.querySelectorAll('td')).slice(2).concat(
            ...Array.from(otherRow.querySelectorAll('td'))
        );

        return cells.map(cell => {
            return parseInt(cell.textContent)
        })
    }

    getRoundsCount() {
        return this._getRoundRows().length;
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