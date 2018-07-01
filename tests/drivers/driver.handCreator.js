import {HTMLDriver} from "../utils";

export class HandCreatorViewDriver extends HTMLDriver{
    constructor(dom) {
        super(dom);

        this.form = this.root.querySelector('form');
    }

    clickTile(tile) {
        this.click(`img[src*="${tile.toTypeString()}"]`, 'click');
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

        return sets[setIndex].querySelectorAll('img').length;
    }

    getRevealedSetsCount() {
        return this.root.querySelectorAll('.handContent .revealedSet').length;
    }
}
