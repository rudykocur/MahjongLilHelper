const mochaJsdom = require('mocha-jsdom');
import {Hand, Tiles, Pung, Kong, Pair, FreeTiles} from "../js/hand";
import {Player, Game} from "../js/game";

const jsdom = require("jsdom");
const expect = require('chai').expect;

import {HandCreatorView} from '../js/view/handCreator.js';

function fireEvent(root, selector, eventName) {
    let element = root.querySelector(selector);
    var evt = element.ownerDocument.createEvent("HTMLEvents");
    evt.initEvent(eventName, true, true);
    element.dispatchEvent(evt)
}

function clickElement(root, selector) {
    fireEvent(root, selector, 'click');
}

function clickTile(root, tile) {
    fireEvent(root, `img[src*="${tile.toTypeString()}"]`, 'click');
}

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
};

function createGame() {
    return new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4'));
}

describe('DOM: hand creator tests', function () {

    mochaJsdom();
    let htmlRoot, game, round, player;

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
        })
    });

    it('finishing hand edit - round & player', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.player.name).to.be.equal(player.name);
            expect(data.round.roundNumber).to.be.equal(1);
            done();
        });

        clickElement(htmlRoot, SELECTORS.btnFinishHand);
    });

    it('adding kong', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(4);
            expect(hand.getTileCount(Tiles.Bamboo2)).to.be.equal(4);
            done();
        });

        clickTile(htmlRoot, Tiles.Bamboo2);
        clickElement(htmlRoot, SELECTORS.btnAddKong);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
    });

    it('adding pung', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(3);
            expect(hand.getTileCount(Tiles.Bamboo3)).to.be.equal(3);
            done();
        });

        clickTile(htmlRoot, Tiles.Bamboo3);
        clickElement(htmlRoot, SELECTORS.btnAddPung);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
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

        clickTile(htmlRoot, Tiles.Bamboo3);
        clickTile(htmlRoot, Tiles.Bamboo5);
        clickTile(htmlRoot, Tiles.Bamboo4);
        clickElement(htmlRoot, SELECTORS.btnAddChow);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
    });

    it('adding pair', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(2);
            expect(hand.getTileCount(Tiles.Bamboo3)).to.be.equal(2);
            done();
        });

        clickTile(htmlRoot, Tiles.Bamboo3);
        clickElement(htmlRoot, SELECTORS.btnAddPair);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
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

        clickTile(htmlRoot, Tiles.BonusAutumn);
        clickTile(htmlRoot, Tiles.BonusFlower2);
        clickElement(htmlRoot, SELECTORS.btnAddTiles);
        clickTile(htmlRoot, Tiles.BonusFlower1);
        clickTile(htmlRoot, Tiles.BonusSummer);
        clickElement(htmlRoot, SELECTORS.btnAddTiles);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
    });

    it('not adding clicked tiles', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            let hand = getHand(data);
            expect(hand.tiles.length).to.be.equal(0);
            done();
        });

        clickTile(htmlRoot, Tiles.BonusAutumn);
        clickTile(htmlRoot, Tiles.BonusFlower2);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
    });

    it('selecting winner', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.isWinner).to.be.equal(true);
            done();
        });

        clickElement(htmlRoot, SELECTORS.checkboxIsWinner);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
    });

    it('selecting last available tile', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.lastAvailableTile).to.be.equal(true);
            done();
        });

        clickElement(htmlRoot, SELECTORS.checkboxLastAvailableTile);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
    });

    it('selecting last tile from wall', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.lastTileFromWall).to.be.equal(true);
            done();
        });

        clickElement(htmlRoot, SELECTORS.checkboxLastTileFromWall);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
    });

    it('selecting last special', function (done) {
        let view = initDefaultView();
        view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
            expect(data.lastTileSpecial).to.be.equal(true);
            done();
        });

        clickElement(htmlRoot, SELECTORS.checkboxLastTileSpecial);
        clickElement(htmlRoot, SELECTORS.btnFinishHand);
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

        clickElement(htmlRoot, SELECTORS.btnFinishHand);
    })

});