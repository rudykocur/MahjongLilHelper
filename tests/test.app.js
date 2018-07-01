import {Game, Player} from "../js/game";

const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').use(require('sinon-chai'));

import {EventEmitter} from "../js/utils";
import {MahjongLilHelperMainViewController, MainAppUI} from "../js/app";
import {Hand, Kong, Pung, Tiles} from "../js/hand";

function createGame() {
    return new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4'));
}

describe('Main App tests', () => {

    let /*Game*/game, /*Round*/round, player, /*MainAppUI*/appView;

    beforeEach(() => {
        game = createGame();
        round = game.createRound();
        player = game.players[0];

        appView = {
            setMode: sinon.fake(),
            handCreator: {
                onEditFinish: new EventEmitter(),
                show: sinon.fake(),
            },
            balanceTable: {
                onHandEditClick: new EventEmitter(),
                addRoundEvent: new EventEmitter(),
                renderGameBalance: sinon.fake(),
            }
        };
    });

    it('app loads game state into table', () => {
        let app = new MahjongLilHelperMainViewController(appView);

        app.loadState(game);


        expect(appView.balanceTable.renderGameBalance).calledWithExactly(game);
    });

    it('app opens hand creator after onHandEditClick', () => {
        let app = new MahjongLilHelperMainViewController(appView);

        app.loadState(game);

        appView.balanceTable.onHandEditClick.emit({
            round: round,
            player: game.players[2],
        });

        expect(appView.handCreator.show).calledWithExactly(round, game.players[2])
    });

    it('app handles onEditFinish even', () => {
        let app = new MahjongLilHelperMainViewController(appView);

        round.setHand = sinon.fake();
        round.setWinner = sinon.fake();

        let expectedHand = new Hand();
        expectedHand.addSet(new Kong(false, Tiles.Bamboo3));
        expectedHand.addSet(new Pung(true, Tiles.Bamboo2));

        app.loadState(game);

        appView.handCreator.onEditFinish.emit({
            round: round,
            player: game.players[2],
            tilesets: [new Kong(false, Tiles.Bamboo3), new Pung(true, Tiles.Bamboo2)],
            isWinner: false,
            lastTileFromWall: true,
            lastTileSpecial: true,
            lastAvailableTile: true
        });

        expect(round.setHand).calledWith(game.players[2], expectedHand);
        sinon.assert.notCalled(round.setWinner);
        expect(appView.balanceTable.renderGameBalance).calledWithExactly(game);
    });

    it('app sets winner if was selected', () => {
        let app = new MahjongLilHelperMainViewController(appView);

        round.setHand = sinon.fake();
        round.setWinner = sinon.fake();

        app.loadState(game);

        appView.handCreator.onEditFinish.emit({
            round: round,
            player: game.players[2],
            tilesets: [new Kong(false, Tiles.Bamboo3), new Pung(true, Tiles.Bamboo2)],
            isWinner: true,
            lastTileFromWall: true,
            lastTileSpecial: true,
            lastAvailableTile: true
        });

        expect(round.setWinner).calledWithExactly(game.players[2], true, true);
    });

    it('app adds new round to the game and refresh table', () => {
        let app = new MahjongLilHelperMainViewController(appView);

        game.createRound = sinon.fake();

        app.loadState(game);

        appView.balanceTable.addRoundEvent.emit();

        expect(game.createRound).calledWithExactly();
        expect(appView.balanceTable.renderGameBalance).calledWithExactly(game);
    })
});