const mochaJsdom = require('mocha-jsdom');
import {Hand, Tiles, Pung, Kong, Pair, FreeTiles} from "../js/hand";
import {Player, Game} from "../js/game";

const jsdom = require("jsdom");
const expect = require('chai').expect;

import {HandCreatorView} from '../js/view/handCreator.js';

/**
 * @param {OnEditFinishEvent} event
 * @return {Hand}
 */
function getHand(event) {
    let hand = new Hand();
    event.tilesets.forEach(set => hand.addSet(set));
    return hand;
}

const SELECTORS = {
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

class HandCreatorViewDriver {
    constructor(root) {
        this.root = root;

        this.form = this.root.querySelector('form');
    }

    _fireEvent(selector, eventName) {
        let element = this.root.querySelector(selector);
        let evt = element.ownerDocument.createEvent("HTMLEvents");
        evt.initEvent(eventName, true, true);
        element.dispatchEvent(evt)
    }

    _setRadio(form, name, value) {
        form.elements[name].value = value;
    }

    clickTile(tile) {
        this._fireEvent(`img[src*="${tile.toTypeString()}"]`, 'click');
    }

    click(selector) {
        this._fireEvent(selector, 'click');
    }

    setIsRevealed(isRevealed) {
        if(isRevealed) {
            this._setRadio(this.form, 'revealed', '1');
        }
        else {
            this._setRadio(this.form, 'revealed', '');
        }

    }
}

function createGame() {
    return new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4'));
}

describe('DOM: hand creator tests', function () {

    mochaJsdom();
    let htmlRoot, game, round, player, driver;

    function initDefaultView() {
        let view = new HandCreatorView(htmlRoot);
        view.initUI();
        view.show(round, player);

        return view;
    }

    beforeEach(() => {
        game = createGame();
        round = game.createRound();
        player = game.players[0];

        return htmlRoot = jsdom.JSDOM.fromFile('./tests/test_html/hand.html').then((dom) => {
            htmlRoot = dom.window.document.body;
            driver = new HandCreatorViewDriver(htmlRoot);
        })
    });

    it('finishing hand edit - round & player', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.player.name).to.be.equal(player.name);
            expect(data.round.roundNumber).to.be.equal(1);
            done();
        });

        driver.click(SELECTORS.btnFinishHand);
    });

    it('adding kong', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(4);
            expect(hand.getTileCount(Tiles.Bamboo2)).to.be.equal(4);
            done();
        });

        driver.clickTile(Tiles.Bamboo2);
        driver.click(SELECTORS.btnAddKong);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('adding pung', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(3);
            expect(hand.getTileCount(Tiles.Bamboo3)).to.be.equal(3);
            done();
        });

        driver.clickTile(Tiles.Bamboo3);
        driver.click(SELECTORS.btnAddPung);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('adding chow', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(3);
            expect(hand.getTileCount(Tiles.Bamboo3)).to.be.equal(1);
            expect(hand.getTileCount(Tiles.Bamboo4)).to.be.equal(1);
            expect(hand.getTileCount(Tiles.Bamboo5)).to.be.equal(1);
            done();
        });

        driver.clickTile(Tiles.Bamboo3);
        driver.clickTile(Tiles.Bamboo5);
        driver.clickTile(Tiles.Bamboo4);
        driver.click(SELECTORS.btnAddChow);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('adding pair', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(2);
            expect(hand.getTileCount(Tiles.Bamboo3)).to.be.equal(2);
            done();
        });

        driver.clickTile(Tiles.Bamboo3);
        driver.click(SELECTORS.btnAddPair);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('adding concealed kong', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            let kongs = hand.getSetsOfType(Kong);
            expect(hand.tiles.length).to.be.equal(4);
            expect(kongs.length).to.be.equal(1);
            expect(kongs[0].isRevealed).to.be.equal(false);
            done();
        });

        driver.clickTile(Tiles.Bamboo3);
        driver.setIsRevealed(false);
        driver.click(SELECTORS.btnAddKong);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('adding few tilesets', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(9);
            expect(hand.sets.length).to.be.equal(3);
            expect(hand.getSetsOfType(Kong).length).to.be.equal(1);
            expect(hand.getSetsOfType(Pair).length).to.be.equal(1);
            expect(hand.getSetsOfType(Pung).length).to.be.equal(1);

            expect(hand.getSetsOfType(Kong)[0].isRevealed).to.be.equal(false);
            expect(hand.getSetsOfType(Pung)[0].isRevealed).to.be.equal(true);
            done();
        });

        driver.clickTile(Tiles.Bamboo3);
        driver.click(SELECTORS.btnAddPung);
        driver.clickTile(Tiles.Bamboo1);
        driver.setIsRevealed(false);
        driver.click(SELECTORS.btnAddKong);
        driver.clickTile(Tiles.Bamboo2);
        driver.click(SELECTORS.btnAddPair);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('adding loose tiles', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(4);
            expect(hand.getTileCount(Tiles.BonusSummer)).to.be.equal(1);
            expect(hand.getTileCount(Tiles.BonusAutumn)).to.be.equal(1);
            expect(hand.getTileCount(Tiles.BonusFlower1)).to.be.equal(1);
            expect(hand.getTileCount(Tiles.BonusFlower2)).to.be.equal(1);
            done();
        });

        driver.clickTile(Tiles.BonusAutumn);
        driver.clickTile(Tiles.BonusFlower2);
        driver.click(SELECTORS.btnAddTiles);
        driver.clickTile(Tiles.BonusFlower1);
        driver.clickTile(Tiles.BonusSummer);
        driver.click(SELECTORS.btnAddTiles);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('not adding clicked tiles', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(0);
            done();
        });

        driver.clickTile(Tiles.BonusAutumn);
        driver.clickTile(Tiles.BonusFlower2);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('selecting winner', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.isWinner).to.be.equal(true);
            done();
        });

        driver.click(SELECTORS.checkboxIsWinner);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('selecting last available tile', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.lastAvailableTile).to.be.equal(true);
            done();
        });

        driver.click(SELECTORS.checkboxLastAvailableTile);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('selecting last tile from wall', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.lastTileFromWall).to.be.equal(true);
            done();
        });

        driver.click(SELECTORS.checkboxLastTileFromWall);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('selecting last special', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.lastTileSpecial).to.be.equal(true);
            done();
        });

        driver.click(SELECTORS.checkboxLastTileSpecial);
        driver.click(SELECTORS.btnFinishHand);
    });

    it('saving loaded hand', (done) => {
        let hand = new Hand();
        hand.addSet(new Pung(true, Tiles.Bamboo5));
        hand.addSet(new Kong(true, Tiles.WindEast));
        hand.addSet(new Pair(Tiles.DragonRed));
        hand.addSet(new FreeTiles([Tiles.BonusFlower1, Tiles.BonusSummer]));
        round.setHand(player, hand);

        let view = new HandCreatorView(htmlRoot);
        view.initUI();
        view.show(round, player);

        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(11);
            expect(hand.getTileCount(Tiles.Bamboo5)).to.be.equal(3);
            expect(hand.getTileCount(Tiles.WindEast)).to.be.equal(4);
            expect(hand.getTileCount(Tiles.DragonRed)).to.be.equal(2);
            expect(hand.getTileCount(Tiles.BonusFlower1)).to.be.equal(1);
            expect(hand.getTileCount(Tiles.BonusSummer)).to.be.equal(1);
            done();
        });

        driver.click(SELECTORS.btnFinishHand);
    })

});