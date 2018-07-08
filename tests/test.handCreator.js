import {HandCreatorViewDriver, SELECTORS} from "./drivers/driver.handCreator";

const mochaJsdom = require('mocha-jsdom');
import {Hand, Tiles, Pung, Kong, Pair, FreeTiles, SpecialSets} from "../js/hand";
import {Player, Game} from "../js/game";

const jsdom = require("jsdom");
const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').use(require('sinon-chai'));

import {loadTemplateHtml} from "./utils";

import {HandCreatorView} from '../js/view/handCreator.js';
import {DomTemplate} from '../js/view/templates';

/**
 * @param {OnEditFinishEvent} event
 * @return {Hand}
 */
function getHand(event) {
    let hand = new Hand();
    event.tilesets.forEach(set => hand.addSet(set));
    return hand;
}

function createGame() {
    return new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4'));
}

class HandCreatorTemplateMock extends DomTemplate {
    constructor(root) {
        super(root);
    }
}

describe('DOM: hand creator tests', () => {

    mochaJsdom();
    let /*Game*/game, /*Round*/round, player, /*HandCreatorViewDriver*/driver;

    function initDefaultView() {
        let view = new HandCreatorView(new HandCreatorTemplateMock(driver.root));
        view.initUI();
        view.showHand(round, player);

        return view;
    }

    /**
     * @return {HandCreatorView}
     */
    function getView() {
        let view = new HandCreatorView(new HandCreatorTemplateMock(driver.root));
        view.initUI();
        return view;
    }

    beforeEach(() => {
        game = createGame();
        round = game.createRound();
        player = game.players[0];

        return loadTemplateHtml('hand.html').then((dom) => {
            driver = new HandCreatorViewDriver(dom);
        })
    });

    describe('Basic tests', () => {

        it('finishing hand edit - round & player', function (done) {
            let view = initDefaultView();
            view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
                expect(data.player.name).to.be.equal(player.name);
                expect(data.round.roundNumber).to.be.equal(1);
                expect(data.specialSet).to.be.equal('');
                done();
            });

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

        it('selecting special set', function () {
            let callback = sinon.spy();

            let view = initDefaultView();
            view.onEditFinish.addListener(callback);

            driver.selectSpecialSet(SpecialSets.major);
            driver.click(SELECTORS.btnFinishHand);

            expect(callback.callCount).to.be.equal(1);
            expect(callback.firstCall.args[0].specialSet).to.be.equal('major');
        });

        it('saving loaded hand', (done) => {
            let hand = new Hand();
            hand.addSet(new Pung(true, Tiles.Bamboo5));
            hand.addSet(new Kong(true, Tiles.WindEast));
            hand.addSet(new Pair(Tiles.DragonRed));
            hand.addSet(new FreeTiles([Tiles.BonusFlower1, Tiles.BonusSummer]));
            round.setHand(player, hand);

            let view = new HandCreatorView(new HandCreatorTemplateMock(driver.root));
            view.initUI();
            view.showHand(round, player);

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
        });

        it('loading hand state with round info', () => {
            let hand = new Hand();
            hand.addSet(new Pung(true, Tiles.Bamboo5));
            round.setHand(player, hand);
            round.setWinner(player, true, true, true);

            let view = getView();
            view.showHand(round, player);

            expect(driver.getIsWinnerChecked()).to.be.true;
            expect(driver.getIsLastAvailableTileChecked()).to.be.true;
            expect(driver.getIsLastTileFromWallChecked()).to.be.true;
            expect(driver.getIsLastTileSpecialChecked()).to.be.true;
        });

        it('loading hand state special set', () => {
            let hand = new Hand();
            hand.addSet(new Pung(true, Tiles.Bamboo5));
            hand.setSpecialSet(SpecialSets.minor);
            round.setHand(player, hand);

            let view = getView();
            view.showHand(round, player);

            expect(driver.getSpecialSetValue()).to.be.equal(SpecialSets.minor);
        });

        it('loading normal hand after winner hand', () => {
            let hand = new Hand();
            hand.addSet(new Pung(true, Tiles.Bamboo5));
            round.setHand(player, hand);
            round.setWinner(player, true, true);

            let hand2 = new Hand();
            hand.addSet(new Pung(false, Tiles.Bamboo4));
            round.setHand(game.players[1], hand2);

            let view = getView();
            view.showHand(round, player);
            view.showHand(round, game.players[1]);

            expect(driver.getIsWinnerChecked()).to.be.false;
            expect(driver.getIsLastAvailableTileChecked()).to.be.false;
            expect(driver.getIsLastTileFromWallChecked()).to.be.false;
            expect(driver.getIsLastTileSpecialChecked()).to.be.false;
        });

        it('loading blank hand after winner hand', () => {
            let hand = new Hand();
            hand.addSet(new Pung(true, Tiles.Bamboo5));
            round.setHand(player, hand);
            round.setWinner(player, true, true);

            let view = getView();
            view.showHand(round, player);
            view.showHand(round, game.players[1]);

            expect(driver.getIsWinnerChecked()).to.be.false;
            expect(driver.getIsLastAvailableTileChecked()).to.be.false;
            expect(driver.getIsLastTileFromWallChecked()).to.be.false;
            expect(driver.getIsLastTileSpecialChecked()).to.be.false;
        });
    });

    describe('Adding tiles', () => {

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

        it('handling missing tiles to chow', function (done) {
            let view = initDefaultView();
            view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
                let hand = getHand(data);
                expect(hand.tiles.length).to.be.equal(0);
                done();
            });

            driver.clickTile(Tiles.Bamboo3);
            driver.click(SELECTORS.btnAddChow);
            driver.click(SELECTORS.btnFinishHand);
        });

        it('not adding empty free tiles', function (done) {
            let view = initDefaultView();
            view.onEditFinish.addListener((/*OnEditFinishEvent*/ data) => {
                let hand = getHand(data);
                expect(hand.tiles.length).to.be.equal(0);
                expect(hand.sets.length).to.be.equal(0);
                done();
            });

            driver.click(SELECTORS.btnAddTiles);
            driver.click(SELECTORS.btnFinishHand);
        });

    });

    describe('UI interactions', () => {
        it('displaying added kong tiles', function () {
            let view = initDefaultView();
            driver.clickTile(Tiles.Bamboo3);
            driver.click(SELECTORS.btnAddKong);

            expect(driver.getVisibleSetsCount()).to.be.equal(1);
            expect(driver.getTilesCountInSet(0)).to.be.equal(4);
        });

        it('removing added set', function () {
            let view = initDefaultView();
            driver.clickTile(Tiles.Bamboo3);
            driver.click(SELECTORS.btnAddKong);
            driver.removeSet(0);

            expect(driver.getVisibleSetsCount()).to.be.equal(0);
        });

        it('showing concealed set', function () {
            let view = initDefaultView();
            driver.clickTile(Tiles.Bamboo3);
            driver.setIsRevealed(false);
            driver.click(SELECTORS.btnAddKong);

            expect(driver.getVisibleSetsCount()).to.be.equal(1);
            expect(driver.getRevealedSetsCount()).to.be.equal(0);
        });

        it('highlighting selected tiles', function () {
            let view = initDefaultView();
            driver.clickTile(Tiles.Bamboo3);
            driver.clickTile(Tiles.Bamboo2);
            driver.clickTile(Tiles.Bamboo1);

            expect(driver.getSelectedTilesCount()).to.be.equal(3);
        });

        it('deselecting selected tiles after second click', function () {
            let view = initDefaultView();
            driver.clickTile(Tiles.Bamboo3);
            driver.clickTile(Tiles.Bamboo2);
            driver.clickTile(Tiles.Bamboo2);

            expect(driver.getSelectedTilesCount()).to.be.equal(1);
        });

        it('reseting selection after adding set', function () {
            let view = initDefaultView();
            driver.clickTile(Tiles.Bamboo3);
            driver.click(SELECTORS.btnAddKong);

            expect(driver.getSelectedTilesCount()).to.be.equal(0);
        });
    })

});