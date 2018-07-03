import {Game, Player} from "../js/game";

const mochaJsdom = require('mocha-jsdom');
const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').use(require('sinon-chai'));

import {EventEmitter} from "../js/utils";
import {MahjongLilHelperMainViewController, MainAppUI} from "../js/app";
import {Hand, Kong, Pung, Tiles} from "../js/hand";
import {DomTemplate} from "../js/view/templates";

function createGame() {
    return new Game(new Player(0, 'P1'), new Player(1, 'P2'), new Player(2, 'P3'), new Player(3, 'P4'));
}

describe('Main App tests', () => {

    describe('Game controller tests', () => {

        let /*Game*/game, /*Round*/round, player, /*MainAppUI*/appView;

        beforeEach(() => {
            game = createGame();
            round = game.createRound();
            player = game.players[0];

            appView = {
                setMode: sinon.fake(),
                showPanel: sinon.fake(),
                handCreator: {
                    onEditFinish: new EventEmitter(),
                    showHand: sinon.fake(),
                },
                balanceTable: {
                    onHandEditClick: new EventEmitter(),
                    addRoundEvent: new EventEmitter(),
                    returnToGameListEvent: new EventEmitter(),
                    renderGameBalance: sinon.fake(),
                },
                gameList: {
                    newGameEvent: new EventEmitter(),
                    gameSelectedEvent: new EventEmitter(),
                    loadGames: sinon.fake(),
                },
                newGameForm: {
                    newGameCreateEvent: new EventEmitter(),
                    cancelEvent: new EventEmitter(),
                }
            };
        });

        it('app loads game state into table', () => {
            let app = new MahjongLilHelperMainViewController(appView);

            app.loadGame(game);


            expect(appView.balanceTable.renderGameBalance).calledWithExactly(game);
        });

        it('app opens hand creator after onHandEditClick', () => {
            let app = new MahjongLilHelperMainViewController(appView);

            app.loadGame(game);

            appView.balanceTable.onHandEditClick.emit({
                round: round,
                player: game.players[2],
            });

            expect(appView.handCreator.showHand).calledWithExactly(round, game.players[2])
        });

        it('app handles onEditFinish even', () => {
            let app = new MahjongLilHelperMainViewController(appView);

            round.setHand = sinon.fake();
            round.setWinner = sinon.fake();

            let expectedHand = new Hand();
            expectedHand.addSet(new Kong(false, Tiles.Bamboo3));
            expectedHand.addSet(new Pung(true, Tiles.Bamboo2));

            app.loadGame(game);

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

            app.loadGame(game);

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

            app.loadGame(game);

            appView.balanceTable.addRoundEvent.emit();

            expect(game.createRound).calledWithExactly();
            expect(appView.balanceTable.renderGameBalance).calledWithExactly(game);
        })
    });

    describe('Game UI panel switcher test', () => {

        mochaJsdom();

        let panels, /*MainAppUI*/view;

        beforeEach(() => {
            panels = {
                handCreator: {
                    initUI: sinon.fake(),
                    show: sinon.fake(),
                    hide: sinon.fake(),
                    getRoot: sinon.fake.returns(document.createElement('div'))
                },
                balanceTable: {
                    show: sinon.fake(),
                    hide: sinon.fake(),
                    getRoot: sinon.fake.returns(document.createElement('div'))
                },
                gameList: {
                    show: sinon.fake(),
                    hide: sinon.fake(),
                    getRoot: sinon.fake.returns(document.createElement('div'))
                },
                newGameForm: {
                    show: sinon.fake(),
                    hide: sinon.fake(),
                    getRoot: sinon.fake.returns(document.createElement('div'))
                },
            };

            view = new MainAppUI(new DomTemplate(document.createElement('div')),
                panels.handCreator, panels.balanceTable, panels.gameList, panels.newGameForm);
        });

        it('hide all panels by default', () => {

            expect(panels.gameList.hide).called;
            expect(panels.handCreator.hide).called;
            expect(panels.balanceTable.hide).called;
            expect(panels.newGameForm.hide).called;

        });

        it('showing first panel', () => {
            view.showPanel(panels.gameList);

            expect(panels.gameList.show).called;
            expect(panels.handCreator.show).not.called;
            expect(panels.balanceTable.show).not.called;
            expect(panels.newGameForm.show).not.called;
        });

        it('switching to second panel', () => {
            view.showPanel(panels.gameList);
            view.showPanel(panels.handCreator);

            expect(panels.gameList.show).called;
            expect(panels.gameList.hide).called;
            expect(panels.handCreator.show).called;
            expect(panels.balanceTable.show).not.called;
            expect(panels.newGameForm.show).not.called;

            expect(panels.gameList.hide).calledAfter(panels.gameList.show);
            expect(panels.handCreator.show).calledAfter(panels.gameList.hide);
        });
    });

    describe('Switching correct panels on events', () => {
        mochaJsdom();

        let /*Array<Game>*/games, /*MainAppUI*/appView;

        beforeEach(() => {
            games = [
                createGame(),
                createGame(),
                createGame()
            ];

            appView = {
                showPanel: sinon.spy(),
                handCreator: {
                    onEditFinish: new EventEmitter(),
                    showHand: sinon.fake(),
                },
                balanceTable: {
                    onHandEditClick: new EventEmitter(),
                    addRoundEvent: new EventEmitter(),
                    returnToGameListEvent: new EventEmitter(),
                    renderGameBalance: sinon.fake(),
                },
                gameList: {
                    newGameEvent: new EventEmitter(),
                    gameSelectedEvent: new EventEmitter(),
                    loadGames: sinon.fake(),
                },
                newGameForm: {
                    newGameCreateEvent: new EventEmitter(),
                    cancelEvent: new EventEmitter(),
                }
            };
        });

        function getApp() {
            let app = new MahjongLilHelperMainViewController(appView);

            app.loadState(games.slice());

            return app
        }

        it('Open game list on load state', () => {
            let app = getApp();

            expect(appView.showPanel).calledWithExactly(appView.gameList);
        });

        it('Open balance table on clicking on game in list', () => {
            let app = getApp();

            appView.gameList.gameSelectedEvent.emit(games[1]);

            expect(appView.showPanel.callCount).to.be.equal(2);
            expect(appView.showPanel.firstCall).calledWithExactly(appView.gameList);
            expect(appView.showPanel.secondCall).calledWithExactly(appView.balanceTable);

            expect(appView.balanceTable.renderGameBalance).calledWithExactly(games[1]);
        });

        it('Open new game form on clicking on button', () => {
            let app = getApp();

            appView.gameList.newGameEvent.emit();

            expect(appView.showPanel.callCount).to.be.equal(2);
            expect(appView.showPanel.firstCall).calledWithExactly(appView.gameList);
            expect(appView.showPanel.secondCall).calledWithExactly(appView.newGameForm);
        });

        it('Adding new game after submiting form', () => {
            let app = getApp();

            appView.gameList.newGameEvent.emit();
            appView.newGameForm.newGameCreateEvent.emit([
                new Player(0, 'A'),
                new Player(1, 'S'),
                new Player(2, 'D'),
                new Player(3, 'F'),
            ]);

            expect(appView.showPanel.callCount).to.be.equal(3);
            expect(appView.showPanel.firstCall).calledWithExactly(appView.gameList);
            expect(appView.showPanel.secondCall).calledWithExactly(appView.newGameForm);
            expect(appView.showPanel.thirdCall).calledWithExactly(appView.gameList);

            games.push(new Game(new Player(0, 'A'),
                new Player(1, 'S'),
                new Player(2, 'D'),
                new Player(3, 'F')));

            expect(appView.gameList.loadGames).calledWithExactly(games);
        });

        it('Return to game list after canceling new game form', () => {
            let app = getApp();

            appView.gameList.newGameEvent.emit();
            appView.newGameForm.cancelEvent.emit();

            expect(appView.showPanel.callCount).to.be.equal(3);
            expect(appView.showPanel.firstCall).calledWithExactly(appView.gameList);
            expect(appView.showPanel.secondCall).calledWithExactly(appView.newGameForm);
            expect(appView.showPanel.thirdCall).calledWithExactly(appView.gameList);

            expect(appView.gameList.loadGames).calledWithExactly(games);
        });

        it('Return to game list after clicking back in game balance', () => {
            let app = getApp();

            appView.gameList.gameSelectedEvent.emit(games[1]);
            appView.balanceTable.returnToGameListEvent.emit();

            expect(appView.showPanel.callCount).to.be.equal(3);
            expect(appView.showPanel.firstCall).calledWithExactly(appView.gameList);
            expect(appView.showPanel.secondCall).calledWithExactly(appView.balanceTable);
            expect(appView.showPanel.thirdCall).calledWithExactly(appView.gameList);

            expect(appView.gameList.loadGames).calledWithExactly(games);
        })

    });
});