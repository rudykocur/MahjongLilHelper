import {HTMLDriver} from "../utils";

export const SELECTORS = {
    btnFinishHand: '[data-action="finishHand"]',
    btnAddPung: '[data-action="addPung"]',
    btnAddKong: '[data-action="addKong"]',
    btnAddChow: '[data-action="addChow"]',
    btnAddPair: '[data-action="addPair"]',
    btnAddTiles: '[data-action="addTiles"]',
    checkboxIsWinner: '[name="isWinner"]',
    checkboxLastTileFromWall: '[name="lastTileFromWall"]',
    checkboxLastTileSpecial: '[name="lastTileSpecial"]',
    checkboxLastAvailableTile: '[name="lastAvailableTile"]',
    radioIsRevealed: '#setRevealed',
    radioIsConcealed: '#setConcealed',
};

export class HandCreatorViewDriver extends HTMLDriver{
    constructor(dom) {
        super(dom);

        this.form = this.root.querySelector('form');
    }

    clickTile(tile) {
        this.click(`.icon-${tile.toTypeString()}`, 'click');
    }

    setIsRevealed(isRevealed) {
        if(isRevealed) {
            this._setRadio(this.form, 'revealed', '1');
        }
        else {
            this._setRadio(this.form, 'revealed', '');
        }
    }

    getSelectedTilesCount() {
        return this.root.querySelectorAll('.suitGroups .selected').length;
    }

    _getAddedSets() {
        return this.root.querySelectorAll('.handContent ul');
    }

    removeSet(setIndex) {
        let sets = this._getAddedSets();

        this.click(sets[setIndex].querySelector('.actionDelete'));
    }

    getVisibleSetsCount() {
        return this._getAddedSets().length;
    }

    getTilesCountInSet(setIndex) {
        let sets = this._getAddedSets();

        return sets[setIndex].querySelectorAll('.tile-icon').length;
    }

    getRevealedSetsCount() {
        return this.root.querySelectorAll('.handContent .revealedSet').length;
    }

    getIsWinnerChecked() {
        return this.root.querySelector(SELECTORS.checkboxIsWinner).checked;
    }

    getIsLastTileFromWallChecked() {
        return this.root.querySelector(SELECTORS.checkboxLastTileFromWall).checked;
    }

    getIsLastTileSpecialChecked() {
        return this.root.querySelector(SELECTORS.checkboxLastTileSpecial).checked;
    }

    getIsLastAvailableTileChecked() {
        return this.root.querySelector(SELECTORS.checkboxLastAvailableTile).checked;
    }
}
