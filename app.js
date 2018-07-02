(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MahjongLilHelperMainViewController = exports.MainAppUI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _dec2, _class2;

var _hand = require('./hand.js');

var _game = require('./game.js');

var _handCreator = require('./view/handCreator.js');

var _gameBalance = require('./view/gameBalance');

var _needlepoint = require('needlepoint');

var _templates = require('./view/templates');

var _gamesList = require('./view/gamesList');

var _newGameForm = require('./view/newGameForm');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} OnEditFinishEvent
 * @property {Round} round
 * @property {Player} player
 * @property {Array<TileSet>} tilesets
 * @property {boolean} isWinner
 * @property {boolean} lastTileFromWall
 * @property {boolean} lastAvailableTile
 * @property {boolean} lastTileSpecial
 */

/**
 * @typedef {Object} OnHandEditEvent
 * @property {Round} round
 * @property {Player} player
 */

var MainAppUI = exports.MainAppUI = (_dec = (0, _needlepoint.dependencies)((0, _templates.domLoader)('AppTemplate'), _handCreator.HandCreatorView, _gameBalance.GameBalanceTableView, _gamesList.GamesListView, _newGameForm.NewGameFormView), _dec(_class = function () {

    /**
     * @param {DomTemplate} template
     * @param {HandCreatorView} handCreator
     * @param {GameBalanceTableView} balanceView
     * @param {GamesListView} gameList
     * @param {NewGameFormView} newGameForm
     */
    function MainAppUI(template, handCreator, balanceView, gameList, newGameForm) {
        var _this = this;

        _classCallCheck(this, MainAppUI);

        this.root = template.getRoot();

        this.handCreator = handCreator;
        this.balanceTable = balanceView;
        this.gameList = gameList;
        this.newGameForm = newGameForm;

        this.panels = [this.handCreator, this.balanceTable, this.gameList, this.newGameForm];
        /**
         *
         * @type {GamePanel}
         */
        this.activePanel = null;

        this.panels.forEach(function (panel) {
            _this.root.appendChild(panel.getRoot());
            panel.hide();
        });

        this.handCreator.initUI();
    }

    _createClass(MainAppUI, [{
        key: 'showPanel',
        value: function showPanel(panel) {
            if (this.activePanel) {
                this.activePanel.hide();
            }

            this.activePanel = panel;

            this.activePanel.show();
        }
    }, {
        key: 'mount',
        value: function mount(parent) {
            parent.appendChild(this.root);
        }
    }]);

    return MainAppUI;
}()) || _class);
var MahjongLilHelperMainViewController = exports.MahjongLilHelperMainViewController = (_dec2 = (0, _needlepoint.dependencies)(MainAppUI), _dec2(_class2 = function () {

    /**
     * @param {MainAppUI} view
     */
    function MahjongLilHelperMainViewController(view) {
        var _this2 = this;

        _classCallCheck(this, MahjongLilHelperMainViewController);

        this.view = view;

        /**
         * @type {Game}
         */
        this.currentGame = null;

        /**
         * @type {Array<Game>}
         */
        this.games = [];

        this.view.gameList.gameSelectedEvent.addListener(function (game) {
            _this2.loadGame(game);
        });

        this.view.gameList.newGameEvent.addListener(function () {
            return _this2.view.showPanel(_this2.view.newGameForm);
        });

        this.view.newGameForm.cancelEvent.addListener(function () {
            return _this2.view.showPanel(_this2.view.gameList);
        });

        this.view.newGameForm.newGameCreateEvent.addListener(function (players) {
            return _this2.addNewGame(players);
        });

        this.view.balanceTable.onHandEditClick.addListener(function ( /*OnHandEditEvent*/event) {
            _this2.view.showPanel(_this2.view.handCreator);

            _this2.view.handCreator.showHand(event.round, event.player);
        });

        this.view.balanceTable.addRoundEvent.addListener(function () {
            _this2.currentGame.createRound();
            _this2.view.balanceTable.renderGameBalance(_this2.currentGame);
        });

        this.view.handCreator.onEditFinish.addListener(this.handleHandEditFinish.bind(this));
    }

    _createClass(MahjongLilHelperMainViewController, [{
        key: 'loadState',
        value: function loadState(games) {
            this.view.showPanel(this.view.gameList);

            this.games = games;
            this.view.gameList.loadGames(this.games);
        }
    }, {
        key: 'loadGame',
        value: function loadGame(game) {
            this.view.showPanel(this.view.balanceTable);
            this.currentGame = game;
            this.view.balanceTable.renderGameBalance(this.currentGame);
        }
    }, {
        key: 'addNewGame',
        value: function addNewGame(players) {
            this.games.push(new (Function.prototype.bind.apply(_game.Game, [null].concat(_toConsumableArray(players))))());

            this.view.showPanel(this.view.gameList);

            this.view.gameList.loadGames(this.games);
        }

        /**
         * @param {OnEditFinishEvent} event
         */

    }, {
        key: 'handleHandEditFinish',
        value: function handleHandEditFinish(event) {
            // this.view.setMode(UI_MODE.table);
            this.view.showPanel(this.view.balanceTable);

            var hand = new _hand.Hand();
            event.tilesets.forEach(function (set) {
                return hand.addSet(set);
            });

            event.round.setHand(event.player, hand);
            if (event.isWinner) {
                event.round.setWinner(event.player, event.lastAvailableTile, event.lastTileFromWall);
            }

            this.view.balanceTable.renderGameBalance(this.currentGame);
        }
    }]);

    return MahjongLilHelperMainViewController;
}()) || _class2);

},{"./game.js":2,"./hand.js":3,"./view/gameBalance":7,"./view/gamesList":9,"./view/handCreator.js":10,"./view/newGameForm":11,"./view/templates":12,"needlepoint":15}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RoundBalanceCalculator = exports.Player = exports.Round = exports.Game = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hand = require('./hand.js');

var hand = _interopRequireWildcard(_hand);

var _scoring = require('./scoring.js');

var score = _interopRequireWildcard(_scoring);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player(seatNumber, name) {
    _classCallCheck(this, Player);

    this.seatNumber = seatNumber;
    this.name = name;
};

var Round = function () {
    function Round(players, roundIndex) {
        _classCallCheck(this, Round);

        this.roundNumber = roundIndex + 1;
        this.roundIndex = roundIndex;

        this.balanceCalculator = new RoundBalanceCalculator();
        this.scoreCalculator = score.ScoreCalculator.createDefaultScoreCalculator();

        this.windPhase = Math.floor(this.roundIndex / 4);
        this.windIndicator = hand.WindOrder[this.windPhase % 4];

        this.eastWindPlayer = players[this.roundIndex % 4];

        this.winner = null;
        this.lastAvailableTile = false;
        this.lastTileFromWall = false;

        this.hands = [{ player: players[0], hand: null }, { player: players[1], hand: null }, { player: players[2], hand: null }, { player: players[3], hand: null }];

        this.players = players;
        this.roundScores = [0, 0, 0, 0];
    }

    _createClass(Round, [{
        key: 'setHand',
        value: function setHand(player, hand) {
            this.hands[player.seatNumber].hand = hand;

            this.roundScores[player.seatNumber] = this.scoreCalculator.calculateScore(this, player);
        }
    }, {
        key: 'setWinner',
        value: function setWinner(player, lastAvailableTile, lastTileFromWall) {
            var _this = this;

            this.winner = player;
            this.lastAvailableTile = lastAvailableTile || false;
            this.lastTileFromWall = lastTileFromWall || false;

            this.players.forEach(function (player, index) {
                _this.roundScores[index] = _this.scoreCalculator.calculateScore(_this, player);
            });
        }
    }, {
        key: 'getHand',
        value: function getHand(player) {
            return this.hands[player.seatNumber];
        }
    }, {
        key: 'getPlayerWind',
        value: function getPlayerWind(player) {
            var playerIndex = (this.windPhase + player.seatNumber - (this.roundIndex + this.windPhase) % 4) % 4;

            if (playerIndex < 0) {
                return hand.WindOrder[hand.WindOrder.length + playerIndex];
            }

            return hand.WindOrder[playerIndex];
        }
    }, {
        key: 'getRoundBalance',
        value: function getRoundBalance() {
            return this.balanceCalculator.getBalance(this, this.players, this.roundScores);
        }
    }]);

    return Round;
}();

var RoundBalanceCalculator = function () {
    function RoundBalanceCalculator() {
        _classCallCheck(this, RoundBalanceCalculator);
    }

    _createClass(RoundBalanceCalculator, [{
        key: 'getBalance',
        value: function getBalance(round, players, scores) {

            var result = [0, 0, 0, 0];

            for (var i = 0; i < players.length; i++) {
                for (var j = i + 1; j < players.length; j++) {
                    var p1 = players[i];
                    var p2 = players[j];

                    var srcIdx = p1.seatNumber;
                    var otherIdx = p2.seatNumber;

                    var _score = 0;
                    var mult = 1;

                    var dealsWithEastWind = p1 === round.eastWindPlayer || p2 === round.eastWindPlayer;
                    var dealsWithWinner = p1 === round.winner || p2 === round.winner;

                    if (dealsWithEastWind) {
                        mult = 2;
                    }

                    var gainer = void 0,
                        loser = void 0;

                    if (dealsWithWinner) {
                        gainer = p1 === round.winner ? p1 : p2;
                        loser = p1 !== round.winner ? p1 : p2;

                        _score = scores[gainer.seatNumber];
                    } else {
                        gainer = scores[srcIdx] >= scores[otherIdx] ? p1 : p2;
                        loser = scores[srcIdx] < scores[otherIdx] ? p1 : p2;

                        _score = scores[gainer.seatNumber] - scores[loser.seatNumber];
                    }

                    result[gainer.seatNumber] += _score * mult;
                    result[loser.seatNumber] -= _score * mult;
                }
            }

            return result;
        }
    }]);

    return RoundBalanceCalculator;
}();

var Game = function () {
    function Game(p1, p2, p3, p4) {
        _classCallCheck(this, Game);

        /**
         * @type {Array<Player>}
         */
        this.players = [p1, p2, p3, p4];

        this.rounds = [];
    }

    /**
     * @return {Round}
     */


    _createClass(Game, [{
        key: 'createRound',
        value: function createRound() {
            var round = new Round(this.players, this.rounds.length);

            this.rounds.push(round);

            return round;
        }
    }, {
        key: 'getTotalBalance',
        value: function getTotalBalance(maxRoundNumber) {
            var result = [0, 0, 0, 0];

            maxRoundNumber = maxRoundNumber === undefined ? this.rounds.length : maxRoundNumber;

            this.rounds.slice(0, maxRoundNumber + 1).forEach(function (round) {
                var roundBalance = round.getRoundBalance();

                result[0] += roundBalance[0];
                result[1] += roundBalance[1];
                result[2] += roundBalance[2];
                result[3] += roundBalance[3];
            });

            return result;
        }
    }]);

    return Game;
}();

// module.exports = {Game, Round, Player, RoundBalanceCalculator};


exports.Game = Game;
exports.Round = Round;
exports.Player = Player;
exports.RoundBalanceCalculator = RoundBalanceCalculator;

},{"./hand.js":3,"./scoring.js":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TileGroups;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Suits = {
    BAMBOO: 'bamboo',
    CIRCLE: 'circle',
    CHARACTER: 'character',
    DRAGON: 'dragon',
    WIND: 'wind',
    BONUS: 'bonus'
};

var Dragons = {
    RED: 'red',
    GREEN: 'green',
    WHITE: 'white'
};

var Winds = {
    EAST: 'east',
    WEST: 'west',
    NORTH: 'north',
    SOUTH: 'south'
};

var Bonus = {
    FLOWER1: 'flower1',
    FLOWER2: 'flower2',
    FLOWER3: 'flower3',
    FLOWER4: 'flower4',
    SUMMER: 'summer',
    SPRING: 'spring',
    AUTUMN: 'autumn',
    WINTER: 'winter'
};

var Tile = function () {
    function Tile(isSuit, isHonour) {
        _classCallCheck(this, Tile);

        this.isSuit = isSuit;
        this.isHonour = isHonour;
    }

    _createClass(Tile, [{
        key: 'equals',
        value: function equals(other) {
            if (this.isSuit !== other.isSuit) {
                return false;
            }

            return this.isHonour === other.isHonour;
        }
    }]);

    return Tile;
}();

var SuitTile = function (_Tile) {
    _inherits(SuitTile, _Tile);

    function SuitTile(suit, number) {
        _classCallCheck(this, SuitTile);

        var _this = _possibleConstructorReturn(this, (SuitTile.__proto__ || Object.getPrototypeOf(SuitTile)).call(this, true, number < 2 || number > 8));

        _this.suit = suit;
        _this.number = number;
        return _this;
    }

    _createClass(SuitTile, [{
        key: 'toString',
        value: function toString() {
            return '[SuitTile ' + this.suit + this.number + ']';
        }
    }, {
        key: 'toTypeString',
        value: function toTypeString() {
            return 'suit-' + this.suit + '-' + this.number;
        }
    }, {
        key: 'equals',
        value: function equals(other) {
            if (!_get(SuitTile.prototype.__proto__ || Object.getPrototypeOf(SuitTile.prototype), 'equals', this).call(this, other)) {
                return false;
            }

            if (this.suit !== other.suit) {
                return false;
            }

            return this.number === other.number;
        }
    }]);

    return SuitTile;
}(Tile);

var DragonTile = function (_Tile2) {
    _inherits(DragonTile, _Tile2);

    function DragonTile(kind) {
        _classCallCheck(this, DragonTile);

        var _this2 = _possibleConstructorReturn(this, (DragonTile.__proto__ || Object.getPrototypeOf(DragonTile)).call(this, false, true));

        _this2.dragonKind = kind;
        return _this2;
    }

    _createClass(DragonTile, [{
        key: 'toString',
        value: function toString() {
            return '[DragonTile ' + this.dragonKind + ']';
        }
    }, {
        key: 'toTypeString',
        value: function toTypeString() {
            return 'dragon-' + this.dragonKind;
        }
    }, {
        key: 'equals',
        value: function equals(other) {
            if (!_get(DragonTile.prototype.__proto__ || Object.getPrototypeOf(DragonTile.prototype), 'equals', this).call(this, other)) {
                return false;
            }

            return this.dragonKind === other.dragonKind;
        }
    }]);

    return DragonTile;
}(Tile);

var WindTile = function (_Tile3) {
    _inherits(WindTile, _Tile3);

    function WindTile(kind) {
        _classCallCheck(this, WindTile);

        var _this3 = _possibleConstructorReturn(this, (WindTile.__proto__ || Object.getPrototypeOf(WindTile)).call(this, false, true));

        _this3.windKind = kind;
        return _this3;
    }

    _createClass(WindTile, [{
        key: 'toString',
        value: function toString() {
            return '[WindTile ' + this.windKind + ']';
        }
    }, {
        key: 'toTypeString',
        value: function toTypeString() {
            return 'wind-' + this.windKind;
        }
    }, {
        key: 'equals',
        value: function equals(other) {
            if (!_get(WindTile.prototype.__proto__ || Object.getPrototypeOf(WindTile.prototype), 'equals', this).call(this, other)) {
                return false;
            }

            return this.windKind === other.windKind;
        }
    }]);

    return WindTile;
}(Tile);

var BonusTile = function (_Tile4) {
    _inherits(BonusTile, _Tile4);

    function BonusTile(kind) {
        _classCallCheck(this, BonusTile);

        var _this4 = _possibleConstructorReturn(this, (BonusTile.__proto__ || Object.getPrototypeOf(BonusTile)).call(this, false, false));

        _this4.bonusKind = kind;
        return _this4;
    }

    _createClass(BonusTile, [{
        key: 'toTypeString',
        value: function toTypeString() {
            return 'bonus-' + this.bonusKind;
        }
    }, {
        key: 'equals',
        value: function equals(other) {
            if (!_get(BonusTile.prototype.__proto__ || Object.getPrototypeOf(BonusTile.prototype), 'equals', this).call(this, other)) {
                return false;
            }

            return this.bonusKind === other.bonusKind;
        }
    }]);

    return BonusTile;
}(Tile);

var Tiles = {
    Circle1: new SuitTile(Suits.CIRCLE, 1),
    Circle2: new SuitTile(Suits.CIRCLE, 2),
    Circle3: new SuitTile(Suits.CIRCLE, 3),
    Circle4: new SuitTile(Suits.CIRCLE, 4),
    Circle5: new SuitTile(Suits.CIRCLE, 5),
    Circle6: new SuitTile(Suits.CIRCLE, 6),
    Circle7: new SuitTile(Suits.CIRCLE, 7),
    Circle8: new SuitTile(Suits.CIRCLE, 8),
    Circle9: new SuitTile(Suits.CIRCLE, 9),

    Bamboo1: new SuitTile(Suits.BAMBOO, 1),
    Bamboo2: new SuitTile(Suits.BAMBOO, 2),
    Bamboo3: new SuitTile(Suits.BAMBOO, 3),
    Bamboo4: new SuitTile(Suits.BAMBOO, 4),
    Bamboo5: new SuitTile(Suits.BAMBOO, 5),
    Bamboo6: new SuitTile(Suits.BAMBOO, 6),
    Bamboo7: new SuitTile(Suits.BAMBOO, 7),
    Bamboo8: new SuitTile(Suits.BAMBOO, 8),
    Bamboo9: new SuitTile(Suits.BAMBOO, 9),

    Character1: new SuitTile(Suits.CHARACTER, 1),
    Character2: new SuitTile(Suits.CHARACTER, 2),
    Character3: new SuitTile(Suits.CHARACTER, 3),
    Character4: new SuitTile(Suits.CHARACTER, 4),
    Character5: new SuitTile(Suits.CHARACTER, 5),
    Character6: new SuitTile(Suits.CHARACTER, 6),
    Character7: new SuitTile(Suits.CHARACTER, 7),
    Character8: new SuitTile(Suits.CHARACTER, 8),
    Character9: new SuitTile(Suits.CHARACTER, 9),

    DragonRed: new DragonTile(Dragons.RED),
    DragonWhite: new DragonTile(Dragons.WHITE),
    DragonGreen: new DragonTile(Dragons.GREEN),

    WindEast: new WindTile(Winds.EAST),
    WindWest: new WindTile(Winds.WEST),
    WindNorth: new WindTile(Winds.NORTH),
    WindSouth: new WindTile(Winds.SOUTH),

    BonusFlower1: new BonusTile(Bonus.FLOWER1),
    BonusFlower2: new BonusTile(Bonus.FLOWER2),
    BonusFlower3: new BonusTile(Bonus.FLOWER3),
    BonusFlower4: new BonusTile(Bonus.FLOWER4),
    BonusSummer: new BonusTile(Bonus.SUMMER),
    BonusSpring: new BonusTile(Bonus.SPRING),
    BonusAutumn: new BonusTile(Bonus.AUTUMN),
    BonusWinter: new BonusTile(Bonus.WINTER)
};

var TileGroups = (_TileGroups = {}, _defineProperty(_TileGroups, Suits.BAMBOO, [Tiles.Bamboo1, Tiles.Bamboo2, Tiles.Bamboo3, Tiles.Bamboo4, Tiles.Bamboo5, Tiles.Bamboo6, Tiles.Bamboo7, Tiles.Bamboo8, Tiles.Bamboo9]), _defineProperty(_TileGroups, Suits.CIRCLE, [Tiles.Circle1, Tiles.Circle2, Tiles.Circle3, Tiles.Circle4, Tiles.Circle5, Tiles.Circle6, Tiles.Circle7, Tiles.Circle8, Tiles.Circle9]), _defineProperty(_TileGroups, Suits.CHARACTER, [Tiles.Character1, Tiles.Character2, Tiles.Character3, Tiles.Character4, Tiles.Character5, Tiles.Character6, Tiles.Character7, Tiles.Character8, Tiles.Character9]), _defineProperty(_TileGroups, Suits.DRAGON, [Tiles.DragonRed, Tiles.DragonGreen, Tiles.DragonWhite]), _defineProperty(_TileGroups, Suits.WIND, [Tiles.WindWest, Tiles.WindEast, Tiles.WindNorth, Tiles.WindSouth]), _defineProperty(_TileGroups, Suits.BONUS, [Tiles.BonusFlower1, Tiles.BonusFlower2, Tiles.BonusFlower3, Tiles.BonusFlower4, Tiles.BonusSummer, Tiles.BonusSpring, Tiles.BonusAutumn, Tiles.BonusWinter]), _TileGroups);

var WindOrder = [Tiles.WindEast, Tiles.WindSouth, Tiles.WindWest, Tiles.WindNorth];

var TileSet = function () {
    function TileSet(revealed, tiles) {
        _classCallCheck(this, TileSet);

        this.isRevealed = revealed;
        this.tiles = tiles;

        this.simpleSet = tiles[0] instanceof SuitTile && !tiles[0].isHonour;
    }

    _createClass(TileSet, [{
        key: 'getTile',
        value: function getTile() {
            return this.tiles[0];
        }
    }]);

    return TileSet;
}();

var Chow = function (_TileSet) {
    _inherits(Chow, _TileSet);

    function Chow(revealed, tile1, tile2, tile3) {
        _classCallCheck(this, Chow);

        return _possibleConstructorReturn(this, (Chow.__proto__ || Object.getPrototypeOf(Chow)).call(this, revealed, [tile1, tile2, tile3]));
    }

    return Chow;
}(TileSet);

var Pung = function (_TileSet2) {
    _inherits(Pung, _TileSet2);

    function Pung(revealed, tile) {
        _classCallCheck(this, Pung);

        return _possibleConstructorReturn(this, (Pung.__proto__ || Object.getPrototypeOf(Pung)).call(this, revealed, [tile, tile, tile]));
    }

    return Pung;
}(TileSet);

var Kong = function (_TileSet3) {
    _inherits(Kong, _TileSet3);

    function Kong(revealed, tile) {
        _classCallCheck(this, Kong);

        return _possibleConstructorReturn(this, (Kong.__proto__ || Object.getPrototypeOf(Kong)).call(this, revealed, [tile, tile, tile, tile]));
    }

    return Kong;
}(TileSet);

var Pair = function (_TileSet4) {
    _inherits(Pair, _TileSet4);

    function Pair(tile) {
        _classCallCheck(this, Pair);

        return _possibleConstructorReturn(this, (Pair.__proto__ || Object.getPrototypeOf(Pair)).call(this, false, [tile, tile]));
    }

    return Pair;
}(TileSet);

var FreeTiles = function (_TileSet5) {
    _inherits(FreeTiles, _TileSet5);

    function FreeTiles(tiles) {
        _classCallCheck(this, FreeTiles);

        return _possibleConstructorReturn(this, (FreeTiles.__proto__ || Object.getPrototypeOf(FreeTiles)).call(this, false, tiles));
    }

    return FreeTiles;
}(TileSet);

var Hand = function () {
    function Hand() {
        _classCallCheck(this, Hand);

        this.tiles = [];
        this.sets = [];
    }

    _createClass(Hand, [{
        key: 'addTile',
        value: function addTile(tile) {
            this.tiles.push(tile);
        }
    }, {
        key: 'getTileCount',
        value: function getTileCount(tile) {
            return this.tiles.filter(function (t) {
                return t.equals(tile);
            }).length;
        }
    }, {
        key: 'addSet',
        value: function addSet(tileSet) {
            this.sets.push(tileSet);
            this.tiles = this.tiles.concat(tileSet.tiles);
        }

        /**
         * @return {Array<TileSet>}
         */

    }, {
        key: 'getSetsOfType',
        value: function getSetsOfType(clazz, tileType) {
            var result = this.sets.filter(function (tileSet) {
                return tileSet instanceof clazz;
            });

            if (tileType) {
                result = result.filter(function (tileSet) {
                    return tileSet.getTile() instanceof tileType;
                });
            }

            return result;
        }
    }, {
        key: 'getTilesOfType',
        value: function getTilesOfType(tileType) {
            return this.tiles.filter(function (tile) {
                return tile instanceof tileType;
            });
        }
    }]);

    return Hand;
}();

// module.exports = {
//     Hand, Tiles, SuitTile, Suits, Dragons, DragonTile, Winds, WindTile, Bonus, BonusTile,
//     Chow, Kong, Pung, Pair, WindOrder
// };

exports.Hand = Hand;
exports.Tiles = Tiles;
exports.SuitTile = SuitTile;
exports.Suits = Suits;
exports.Dragons = Dragons;
exports.DragonTile = DragonTile;
exports.Winds = Winds;
exports.WindTile = WindTile;
exports.Bonus = Bonus;
exports.BonusTile = BonusTile;
exports.Chow = Chow;
exports.Kong = Kong;
exports.Pung = Pung;
exports.Pair = Pair;
exports.FreeTiles = FreeTiles;
exports.WindOrder = WindOrder;
exports.TileGroups = TileGroups;

},{}],4:[function(require,module,exports){
"use strict";

var _templates = require("./view/templates");

var _game = require("./game");

var _app = require("./app");

var _needlepoint = require("needlepoint");

function game1() {
    var players = [new _game.Player(0, "Grzesiek"), new _game.Player(1, "Wojtek"), new _game.Player(2, "Gosia"), new _game.Player(3, "Ola")];
    var game = new _game.Game(players[0], players[1], players[2], players[3]);

    var round1 = game.createRound();
    // round1.roundScores = [100, 200, 300, 400];

    var round2 = game.createRound();
    // round2.roundScores = [200, 100, 50, 10];

    var round3 = game.createRound();

    return game;
}

function game2() {
    var players = [new _game.Player(0, "Grzesiek"), new _game.Player(1, "Ratusz"), new _game.Player(2, "Kasia"), new _game.Player(3, "Ola")];
    var game = new _game.Game(players[0], players[1], players[2], players[3]);

    var round1 = game.createRound();
    // round1.roundScores = [100, 200, 300, 400];

    // let round2 = game.createRound();
    // // round2.roundScores = [200, 100, 50, 10];
    //
    // let round3 = game.createRound();

    return game;
}

function game3() {
    var players = [new _game.Player(0, "P1"), new _game.Player(1, "P2"), new _game.Player(2, "P3"), new _game.Player(3, "P4")];
    var game = new _game.Game(players[0], players[1], players[2], players[3]);

    // let round1 = game.createRound();

    return game;
}

document.addEventListener("DOMContentLoaded", function (event) {

    var games = [game1(), game2(), game3()];

    var tmpl = _needlepoint.container.resolve(_templates.TemplateContainer);
    tmpl.discover(document.body);

    var ctrl = _needlepoint.container.resolve(_app.MahjongLilHelperMainViewController);

    ctrl.view.mount(document.getElementById('mahjongContent'));

    ctrl.loadState(games);

    console.log('READY', ctrl);
});

},{"./app":1,"./game":2,"./view/templates":12,"needlepoint":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScoreCalculator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hand = require('./hand.js');

var h = _interopRequireWildcard(_hand);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function calcPungKongValue(baseValue, tileSet) {
    if (!tileSet.simpleSet) {
        baseValue *= 2;
    }

    if (!tileSet.isRevealed) {
        baseValue *= 2;
    }

    return baseValue;
}

function applyMultipliers(numMultipliers, value) {
    for (var i = 0; i < numMultipliers; i++) {
        value *= 2;
    }

    return value;
}

var ScoreCalculator = function () {
    function ScoreCalculator(pointsRules, multipliersForAll, multipliersForWinner) {
        _classCallCheck(this, ScoreCalculator);

        this.pointsRules = pointsRules;
        this.multiplierRulesForAll = multipliersForAll;
        this.multiplierRulesForWinner = multipliersForWinner;
    }

    _createClass(ScoreCalculator, [{
        key: 'calculateScore',
        value: function calculateScore(round, player) {
            var hand = round.getHand(player).hand;

            if (hand === null) {
                return 0;
            }

            var appliedPoints = [];
            var appliedMultipliers = [];

            var points = this.pointsRules.reduce(function (value, rule) {
                var p = rule.getPoints(hand, round, player);
                if (p) {
                    appliedPoints.push({ rule: rule, amount: p });
                }
                return value + (p || 0);
            }, 0);

            var multipliers = this.multiplierRulesForAll.reduce(function (value, rule) {
                var mult = rule.getMultipliers(hand, round, player);

                if (mult) {
                    appliedMultipliers.push({ rule: rule, amount: mult });
                }

                return value + (mult || 0);
            }, 0);

            if (round.winner === player) {
                multipliers = this.multiplierRulesForWinner.reduce(function (value, rule) {
                    var mult = rule.getMultipliers(hand, round, player);

                    if (mult) {
                        appliedMultipliers.push({ rule: rule, multiplier: mult });
                    }

                    return value + (mult || 0);
                }, multipliers);
            }

            return applyMultipliers(multipliers, points);
        }
    }], [{
        key: 'createDefaultScoreCalculator',
        value: function createDefaultScoreCalculator() {
            var pointsRules = [new BonusTilePoints(), new PointsForPairOfRoundWindRule(), new PointsForPairOfOwnWindRule(), new PointsForPairOfDragonsRule(), new PointsForPungRule(), new PointsForKongRule(), new PointsForMahjong(), new PointsForLastAvailableTile(), new PointsForLastTileFromWall()];
            var multiplierRulesForAll = [new DragonSetMultiplier(), new RoundWindSetMultiplier(), new OwnWindSetMultiplier(), new ThreeConcealedPungsMultiplier(), new ThreeLittleSagesMultiplier(), new ThreeGrandSagesMultiplier(), new FourLittleBlessingsMultiplier(), new FourGrandBlessingsMultiplier()];
            var multiplierRulesForWinner = [new PureChowsMultiplier(), new NoChowsMultiplier(), new HalfColorMultiplier()];

            return new ScoreCalculator(pointsRules, multiplierRulesForAll, multiplierRulesForWinner);
        }
    }]);

    return ScoreCalculator;
}();

//#region Rules for points

var PointsRule = function () {
    function PointsRule() {
        _classCallCheck(this, PointsRule);
    }

    _createClass(PointsRule, [{
        key: 'getPoints',
        value: function getPoints(hand, round, player) {}
    }]);

    return PointsRule;
}();

var PointsForTilesetRule = function (_PointsRule) {
    _inherits(PointsForTilesetRule, _PointsRule);

    function PointsForTilesetRule() {
        _classCallCheck(this, PointsForTilesetRule);

        return _possibleConstructorReturn(this, (PointsForTilesetRule.__proto__ || Object.getPrototypeOf(PointsForTilesetRule)).apply(this, arguments));
    }

    _createClass(PointsForTilesetRule, [{
        key: 'getPoints',
        value: function getPoints(hand, round, player) {
            var _this2 = this;

            return hand.sets.reduce(function (value, tileSet) {
                return value + (_this2.getTilesetValue(tileSet, round, player) || 0);
            }, 0);
        }
    }, {
        key: 'getTilesetValue',
        value: function getTilesetValue(tileSet, round, player) {
            return 0;
        }
    }]);

    return PointsForTilesetRule;
}(PointsRule);

var PointsForTileRule = function (_PointsRule2) {
    _inherits(PointsForTileRule, _PointsRule2);

    function PointsForTileRule() {
        _classCallCheck(this, PointsForTileRule);

        return _possibleConstructorReturn(this, (PointsForTileRule.__proto__ || Object.getPrototypeOf(PointsForTileRule)).apply(this, arguments));
    }

    _createClass(PointsForTileRule, [{
        key: 'getPoints',
        value: function getPoints(hand, round, player) {
            var _this4 = this;

            return hand.tiles.reduce(function (value, tile) {
                return value + (_this4.getTileValue(tile) || 0);
            }, 0);
        }
    }, {
        key: 'getTileValue',
        value: function getTileValue(tile) {
            return 0;
        }
    }]);

    return PointsForTileRule;
}(PointsRule);

var BonusTilePoints = function (_PointsForTileRule) {
    _inherits(BonusTilePoints, _PointsForTileRule);

    function BonusTilePoints() {
        _classCallCheck(this, BonusTilePoints);

        return _possibleConstructorReturn(this, (BonusTilePoints.__proto__ || Object.getPrototypeOf(BonusTilePoints)).apply(this, arguments));
    }

    _createClass(BonusTilePoints, [{
        key: 'getTileValue',
        value: function getTileValue(tile) {
            if (tile instanceof h.BonusTile) {
                return 4;
            }
        }
    }]);

    return BonusTilePoints;
}(PointsForTileRule);

var PointsForPairOfDragonsRule = function (_PointsForTilesetRule) {
    _inherits(PointsForPairOfDragonsRule, _PointsForTilesetRule);

    function PointsForPairOfDragonsRule() {
        _classCallCheck(this, PointsForPairOfDragonsRule);

        return _possibleConstructorReturn(this, (PointsForPairOfDragonsRule.__proto__ || Object.getPrototypeOf(PointsForPairOfDragonsRule)).apply(this, arguments));
    }

    _createClass(PointsForPairOfDragonsRule, [{
        key: 'getTilesetValue',
        value: function getTilesetValue(tileSet, round, player) {
            if (!(tileSet instanceof h.Pair)) {
                return;
            }

            if (tileSet.getTile() instanceof h.DragonTile) {
                return 2;
            }
        }
    }]);

    return PointsForPairOfDragonsRule;
}(PointsForTilesetRule);

var PointsForPairOfRoundWindRule = function (_PointsForTilesetRule2) {
    _inherits(PointsForPairOfRoundWindRule, _PointsForTilesetRule2);

    function PointsForPairOfRoundWindRule() {
        _classCallCheck(this, PointsForPairOfRoundWindRule);

        return _possibleConstructorReturn(this, (PointsForPairOfRoundWindRule.__proto__ || Object.getPrototypeOf(PointsForPairOfRoundWindRule)).apply(this, arguments));
    }

    _createClass(PointsForPairOfRoundWindRule, [{
        key: 'getTilesetValue',
        value: function getTilesetValue(tileSet, round) {
            if (!(tileSet instanceof h.Pair)) {
                return;
            }

            if (round.windIndicator.equals(tileSet.getTile())) {
                return 2;
            }
        }
    }]);

    return PointsForPairOfRoundWindRule;
}(PointsForTilesetRule);

var PointsForPairOfOwnWindRule = function (_PointsForTilesetRule3) {
    _inherits(PointsForPairOfOwnWindRule, _PointsForTilesetRule3);

    function PointsForPairOfOwnWindRule() {
        _classCallCheck(this, PointsForPairOfOwnWindRule);

        return _possibleConstructorReturn(this, (PointsForPairOfOwnWindRule.__proto__ || Object.getPrototypeOf(PointsForPairOfOwnWindRule)).apply(this, arguments));
    }

    _createClass(PointsForPairOfOwnWindRule, [{
        key: 'getTilesetValue',
        value: function getTilesetValue(tileSet, round, player) {
            if (!(tileSet instanceof h.Pair)) {
                return;
            }

            if (round.getPlayerWind(player).equals(tileSet.getTile())) {
                return 2;
            }
        }
    }]);

    return PointsForPairOfOwnWindRule;
}(PointsForTilesetRule);

var PointsForPungRule = function (_PointsForTilesetRule4) {
    _inherits(PointsForPungRule, _PointsForTilesetRule4);

    function PointsForPungRule() {
        _classCallCheck(this, PointsForPungRule);

        return _possibleConstructorReturn(this, (PointsForPungRule.__proto__ || Object.getPrototypeOf(PointsForPungRule)).apply(this, arguments));
    }

    _createClass(PointsForPungRule, [{
        key: 'getTilesetValue',
        value: function getTilesetValue(tileSet, round, player) {
            if (tileSet instanceof h.Pung) {
                return calcPungKongValue(2, tileSet);
            }
        }
    }]);

    return PointsForPungRule;
}(PointsForTilesetRule);

var PointsForKongRule = function (_PointsForTilesetRule5) {
    _inherits(PointsForKongRule, _PointsForTilesetRule5);

    function PointsForKongRule() {
        _classCallCheck(this, PointsForKongRule);

        return _possibleConstructorReturn(this, (PointsForKongRule.__proto__ || Object.getPrototypeOf(PointsForKongRule)).apply(this, arguments));
    }

    _createClass(PointsForKongRule, [{
        key: 'getTilesetValue',
        value: function getTilesetValue(tileSet, round, player) {
            if (tileSet instanceof h.Kong) {
                return calcPungKongValue(8, tileSet);
            }
        }
    }]);

    return PointsForKongRule;
}(PointsForTilesetRule);

var PointsForMahjong = function (_PointsRule3) {
    _inherits(PointsForMahjong, _PointsRule3);

    function PointsForMahjong() {
        _classCallCheck(this, PointsForMahjong);

        return _possibleConstructorReturn(this, (PointsForMahjong.__proto__ || Object.getPrototypeOf(PointsForMahjong)).apply(this, arguments));
    }

    _createClass(PointsForMahjong, [{
        key: 'getPoints',
        value: function getPoints(hand, round, player) {
            if (round.winner === player) {
                return 20;
            }
        }
    }]);

    return PointsForMahjong;
}(PointsRule);

var PointsForLastAvailableTile = function (_PointsRule4) {
    _inherits(PointsForLastAvailableTile, _PointsRule4);

    function PointsForLastAvailableTile() {
        _classCallCheck(this, PointsForLastAvailableTile);

        return _possibleConstructorReturn(this, (PointsForLastAvailableTile.__proto__ || Object.getPrototypeOf(PointsForLastAvailableTile)).apply(this, arguments));
    }

    _createClass(PointsForLastAvailableTile, [{
        key: 'getPoints',
        value: function getPoints(hand, round, player) {
            if (round.winner === player && round.lastAvailableTile) {
                return 2;
            }
        }
    }]);

    return PointsForLastAvailableTile;
}(PointsRule);

var PointsForLastTileFromWall = function (_PointsRule5) {
    _inherits(PointsForLastTileFromWall, _PointsRule5);

    function PointsForLastTileFromWall() {
        _classCallCheck(this, PointsForLastTileFromWall);

        return _possibleConstructorReturn(this, (PointsForLastTileFromWall.__proto__ || Object.getPrototypeOf(PointsForLastTileFromWall)).apply(this, arguments));
    }

    _createClass(PointsForLastTileFromWall, [{
        key: 'getPoints',
        value: function getPoints(hand, round, player) {
            if (round.winner === player && round.lastTileFromWall) {
                return 2;
            }
        }
    }]);

    return PointsForLastTileFromWall;
}(PointsRule);

//#endregion

//#region Rules for multipliers

var MultiplierRule = function () {
    function MultiplierRule() {
        _classCallCheck(this, MultiplierRule);
    }

    _createClass(MultiplierRule, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {}
    }]);

    return MultiplierRule;
}();

var DragonSetMultiplier = function (_MultiplierRule) {
    _inherits(DragonSetMultiplier, _MultiplierRule);

    function DragonSetMultiplier() {
        _classCallCheck(this, DragonSetMultiplier);

        return _possibleConstructorReturn(this, (DragonSetMultiplier.__proto__ || Object.getPrototypeOf(DragonSetMultiplier)).apply(this, arguments));
    }

    _createClass(DragonSetMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand) {

            return hand.getSetsOfType(h.Kong, h.DragonTile).concat(hand.getSetsOfType(h.Pung, h.DragonTile)).length;
        }
    }]);

    return DragonSetMultiplier;
}(MultiplierRule);

var RoundWindSetMultiplier = function (_MultiplierRule2) {
    _inherits(RoundWindSetMultiplier, _MultiplierRule2);

    function RoundWindSetMultiplier() {
        _classCallCheck(this, RoundWindSetMultiplier);

        return _possibleConstructorReturn(this, (RoundWindSetMultiplier.__proto__ || Object.getPrototypeOf(RoundWindSetMultiplier)).apply(this, arguments));
    }

    _createClass(RoundWindSetMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round) {
            var windSets = hand.getSetsOfType(h.Kong, h.WindTile).concat(hand.getSetsOfType(h.Pung, h.WindTile));

            return windSets.filter(function (tileSet) {
                return tileSet.getTile().equals(round.windIndicator);
            }).length;
        }
    }]);

    return RoundWindSetMultiplier;
}(MultiplierRule);

var OwnWindSetMultiplier = function (_MultiplierRule3) {
    _inherits(OwnWindSetMultiplier, _MultiplierRule3);

    function OwnWindSetMultiplier() {
        _classCallCheck(this, OwnWindSetMultiplier);

        return _possibleConstructorReturn(this, (OwnWindSetMultiplier.__proto__ || Object.getPrototypeOf(OwnWindSetMultiplier)).apply(this, arguments));
    }

    _createClass(OwnWindSetMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {
            var windSets = hand.getSetsOfType(h.Kong, h.WindTile).concat(hand.getSetsOfType(h.Pung, h.WindTile));

            return windSets.filter(function (tileSet) {
                return tileSet.getTile().equals(round.getPlayerWind(player));
            }).length;
        }
    }]);

    return OwnWindSetMultiplier;
}(MultiplierRule);

var ThreeConcealedPungsMultiplier = function (_MultiplierRule4) {
    _inherits(ThreeConcealedPungsMultiplier, _MultiplierRule4);

    function ThreeConcealedPungsMultiplier() {
        _classCallCheck(this, ThreeConcealedPungsMultiplier);

        return _possibleConstructorReturn(this, (ThreeConcealedPungsMultiplier.__proto__ || Object.getPrototypeOf(ThreeConcealedPungsMultiplier)).apply(this, arguments));
    }

    _createClass(ThreeConcealedPungsMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {
            var pungs = hand.getSetsOfType(h.Pung).filter(function (tileSet) {
                return !tileSet.isRevealed;
            });

            if (pungs.length >= 3) {
                return 1;
            }
        }
    }]);

    return ThreeConcealedPungsMultiplier;
}(MultiplierRule);

var ThreeLittleSagesMultiplier = function (_MultiplierRule5) {
    _inherits(ThreeLittleSagesMultiplier, _MultiplierRule5);

    function ThreeLittleSagesMultiplier() {
        _classCallCheck(this, ThreeLittleSagesMultiplier);

        return _possibleConstructorReturn(this, (ThreeLittleSagesMultiplier.__proto__ || Object.getPrototypeOf(ThreeLittleSagesMultiplier)).apply(this, arguments));
    }

    _createClass(ThreeLittleSagesMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {
            var dragonSets = hand.getSetsOfType(h.Kong, h.DragonTile).concat(hand.getSetsOfType(h.Pung, h.DragonTile));
            var dragonPairs = hand.getSetsOfType(h.Pair, h.DragonTile);

            if (dragonSets.length >= 2 && dragonPairs.length >= 1) {
                return 1;
            }
        }
    }]);

    return ThreeLittleSagesMultiplier;
}(MultiplierRule);

var ThreeGrandSagesMultiplier = function (_MultiplierRule6) {
    _inherits(ThreeGrandSagesMultiplier, _MultiplierRule6);

    function ThreeGrandSagesMultiplier() {
        _classCallCheck(this, ThreeGrandSagesMultiplier);

        return _possibleConstructorReturn(this, (ThreeGrandSagesMultiplier.__proto__ || Object.getPrototypeOf(ThreeGrandSagesMultiplier)).apply(this, arguments));
    }

    _createClass(ThreeGrandSagesMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {
            var dragonSets = hand.getSetsOfType(h.Kong, h.DragonTile).concat(hand.getSetsOfType(h.Pung, h.DragonTile));

            if (dragonSets.length >= 3) {
                return 2;
            }
        }
    }]);

    return ThreeGrandSagesMultiplier;
}(MultiplierRule);

var FourLittleBlessingsMultiplier = function (_MultiplierRule7) {
    _inherits(FourLittleBlessingsMultiplier, _MultiplierRule7);

    function FourLittleBlessingsMultiplier() {
        _classCallCheck(this, FourLittleBlessingsMultiplier);

        return _possibleConstructorReturn(this, (FourLittleBlessingsMultiplier.__proto__ || Object.getPrototypeOf(FourLittleBlessingsMultiplier)).apply(this, arguments));
    }

    _createClass(FourLittleBlessingsMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {
            var windSets = hand.getSetsOfType(h.Kong, h.WindTile).concat(hand.getSetsOfType(h.Pung, h.WindTile));
            var windPairs = hand.getSetsOfType(h.Pair);

            if (windSets.length >= 3 && windPairs.length >= 1) {
                return 1;
            }
        }
    }]);

    return FourLittleBlessingsMultiplier;
}(MultiplierRule);

var FourGrandBlessingsMultiplier = function (_MultiplierRule8) {
    _inherits(FourGrandBlessingsMultiplier, _MultiplierRule8);

    function FourGrandBlessingsMultiplier() {
        _classCallCheck(this, FourGrandBlessingsMultiplier);

        return _possibleConstructorReturn(this, (FourGrandBlessingsMultiplier.__proto__ || Object.getPrototypeOf(FourGrandBlessingsMultiplier)).apply(this, arguments));
    }

    _createClass(FourGrandBlessingsMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {
            var windSets = hand.getSetsOfType(h.Kong, h.WindTile).concat(hand.getSetsOfType(h.Pung, h.WindTile));

            if (windSets.length >= 4) {
                return 2;
            }
        }
    }]);

    return FourGrandBlessingsMultiplier;
}(MultiplierRule);

var PureChowsMultiplier = function (_MultiplierRule9) {
    _inherits(PureChowsMultiplier, _MultiplierRule9);

    function PureChowsMultiplier() {
        _classCallCheck(this, PureChowsMultiplier);

        var _this22 = _possibleConstructorReturn(this, (PureChowsMultiplier.__proto__ || Object.getPrototypeOf(PureChowsMultiplier)).call(this));

        _this22.pointRules = [new PointsForPairOfDragonsRule(), new PointsForPairOfOwnWindRule(), new PointsForPairOfRoundWindRule(), new BonusTilePoints()];
        return _this22;
    }

    _createClass(PureChowsMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {
            var kongsAndPungs = hand.getSetsOfType(h.Kong).concat(hand.getSetsOfType(h.Pung));

            var points = this.pointRules.reduce(function (value, rule) {
                return value + (rule.getPoints(hand, round, player) || 0);
            }, 0);

            if (kongsAndPungs.length === 0 && points === 0) {
                return 1;
            }
        }
    }]);

    return PureChowsMultiplier;
}(MultiplierRule);

var NoChowsMultiplier = function (_MultiplierRule10) {
    _inherits(NoChowsMultiplier, _MultiplierRule10);

    function NoChowsMultiplier() {
        _classCallCheck(this, NoChowsMultiplier);

        return _possibleConstructorReturn(this, (NoChowsMultiplier.__proto__ || Object.getPrototypeOf(NoChowsMultiplier)).apply(this, arguments));
    }

    _createClass(NoChowsMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {
            var chows = hand.getSetsOfType(h.Chow).length;
            var pungs = hand.getSetsOfType(h.Pung).length;
            var kongs = hand.getSetsOfType(h.Kong).length;

            if (chows === 0 && pungs + kongs > 0) {
                return 1;
            }
        }
    }]);

    return NoChowsMultiplier;
}(MultiplierRule);

var HalfColorMultiplier = function (_MultiplierRule11) {
    _inherits(HalfColorMultiplier, _MultiplierRule11);

    function HalfColorMultiplier() {
        _classCallCheck(this, HalfColorMultiplier);

        return _possibleConstructorReturn(this, (HalfColorMultiplier.__proto__ || Object.getPrototypeOf(HalfColorMultiplier)).apply(this, arguments));
    }

    _createClass(HalfColorMultiplier, [{
        key: 'getMultipliers',
        value: function getMultipliers(hand, round, player) {
            var charTiles = hand.getTilesOfType(h.SuitTile).filter(function (tile) {
                return tile.suit === h.Suits.CHARACTER;
            });
            var bambooTiles = hand.getTilesOfType(h.SuitTile).filter(function (tile) {
                return tile.suit === h.Suits.BAMBOO;
            });
            var circleTiles = hand.getTilesOfType(h.SuitTile).filter(function (tile) {
                return tile.suit === h.Suits.CIRCLE;
            });

            var hasCharTiles = charTiles.length > 0;
            var hasBambooTiles = bambooTiles.length > 0;
            var hasCircleTiles = circleTiles.length > 0;

            if (hasCharTiles + hasBambooTiles + hasCircleTiles === 1) {
                return 1;
            }
        }
    }]);

    return HalfColorMultiplier;
}(MultiplierRule);

//#endregion

// module.exports = {ScoreCalculator};


exports.ScoreCalculator = ScoreCalculator;

},{"./hand.js":3}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        this._listeners = [];
    }

    _createClass(EventEmitter, [{
        key: "addListener",
        value: function addListener(callback) {
            this._listeners.push(callback);
        }
    }, {
        key: "emit",
        value: function emit() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            this._listeners.forEach(function (callback) {
                callback.apply(undefined, args);
            });
        }
    }]);

    return EventEmitter;
}();

exports.EventEmitter = EventEmitter;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GameBalanceTableView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _utils = require("../utils");

var _templates = require("./templates");

var _needlepoint = require("needlepoint");

var _gamePanel = require("./gamePanel");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameBalanceTableView = exports.GameBalanceTableView = (_dec = (0, _needlepoint.dependencies)((0, _templates.domLoader)('GameBalanceTemplate')), _dec(_class = function (_GamePanel) {
    _inherits(GameBalanceTableView, _GamePanel);

    /**
     * @param {DomTemplate} template
     */
    function GameBalanceTableView(template) {
        _classCallCheck(this, GameBalanceTableView);

        var _this = _possibleConstructorReturn(this, (GameBalanceTableView.__proto__ || Object.getPrototypeOf(GameBalanceTableView)).call(this, template.getRoot()));

        _this.template = template;
        _this.table = template.getRoot();
        _this.tbody = _this.table.querySelector('tbody');

        _this.onHandEditClick = new _utils.EventEmitter();
        _this.addRoundEvent = new _utils.EventEmitter();

        _this._createdRows = [];

        _this.root.querySelector('[data-action="addRound"]').addEventListener('click', function () {
            _this.addRoundEvent.emit();
        });
        return _this;
    }

    /**
     * @param {Game} game
     */


    _createClass(GameBalanceTableView, [{
        key: "renderGameBalance",
        value: function renderGameBalance(game) {
            var _this2 = this;

            this.template.fillSlots({
                player1Name: game.players[0].name,
                player2Name: game.players[1].name,
                player3Name: game.players[2].name,
                player4Name: game.players[3].name
            });

            this._createdRows.forEach(function (row) {
                return row.parentNode.removeChild(row);
            });
            this._createdRows = [];

            game.rounds.forEach(function (round) {
                var balance = round.getRoundBalance();
                var cumulativeBalance = game.getTotalBalance(round.roundIndex);

                var row = _this2.table.insertRow();
                _this2.tbody.appendChild(row);
                _this2._createdRows.push(row);

                row.insertCell().appendChild(document.createTextNode(round.roundNumber));

                var roundCells = _this2._renderBalance(row, balance);
                _this2._renderBalance(row, cumulativeBalance);

                roundCells.forEach(function (cell, index) {
                    cell.addEventListener('click', function () {
                        _this2.onHandEditClick.emit({
                            round: round,
                            player: game.players[index]
                        });
                    });
                });
            });
        }
    }, {
        key: "_renderBalance",
        value: function _renderBalance(row, balance) {
            return balance.map(function (bal) {
                var cell = row.insertCell();
                cell.appendChild(document.createTextNode(bal));
                return cell;
            });
        }
    }]);

    return GameBalanceTableView;
}(_gamePanel.GamePanel)) || _class);

},{"../utils":6,"./gamePanel":8,"./templates":12,"needlepoint":15}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GamePanel = exports.GamePanel = function () {
    function GamePanel(root) {
        _classCallCheck(this, GamePanel);

        this.root = root;

        this.root.classList.add('gamePanel');
    }

    _createClass(GamePanel, [{
        key: 'getRoot',
        value: function getRoot() {
            return this.root;
        }
    }, {
        key: 'show',
        value: function show() {
            this.root.classList.remove('hidden');
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.root.classList.add('hidden');
        }
    }]);

    return GamePanel;
}();

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GamesListView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _utils = require("../utils");

var _templates = require("./templates");

var _needlepoint = require("needlepoint");

var _gamePanel = require("./gamePanel");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GamesListView = exports.GamesListView = (_dec = (0, _needlepoint.dependencies)((0, _templates.domLoader)('GamesListTemplate')), _dec(_class = function (_GamePanel) {
    _inherits(GamesListView, _GamePanel);

    /**
     * @param {DomTemplate} template
     */
    function GamesListView(template) {
        _classCallCheck(this, GamesListView);

        var _this = _possibleConstructorReturn(this, (GamesListView.__proto__ || Object.getPrototypeOf(GamesListView)).call(this, template.getRoot()));

        _this.gameSelectedEvent = new _utils.EventEmitter();
        _this.newGameEvent = new _utils.EventEmitter();

        _this.gamesList = _this.root.querySelector('ul');

        _this.root.querySelector('button').addEventListener('click', function () {
            _this.newGameEvent.emit();
        });
        return _this;
    }

    /**
     *
     * @param {Array<Game>} gamesList
     */


    _createClass(GamesListView, [{
        key: "loadGames",
        value: function loadGames(gamesList) {
            var _this2 = this;

            while (this.gamesList.firstChild) {
                this.gamesList.removeChild(this.gamesList.firstChild);
            }

            gamesList.forEach(function (game) {
                var row = document.createElement('li');
                row.textContent = _this2._getGameLabel(game);

                row.addEventListener('click', function () {
                    _this2.gameSelectedEvent.emit(game);
                });

                _this2.gamesList.appendChild(row);
            });
        }

        /**
         * @param {Game} game
         */

    }, {
        key: "_getGameLabel",
        value: function _getGameLabel(game) {
            return "Runda " + game.rounds.length + ": " + (game.players[0].name + ", " + game.players[1].name + ", " + game.players[2].name + ", " + game.players[3].name);
        }
    }]);

    return GamesListView;
}(_gamePanel.GamePanel)) || _class);

},{"../utils":6,"./gamePanel":8,"./templates":12,"needlepoint":15}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HandCreatorView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _hand = require("../hand.js");

var _utils = require("../utils.js");

var _templates = require("./templates.js");

var _needlepoint = require("needlepoint");

var _gamePanel = require("./gamePanel");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HandCreatorView = (_dec = (0, _needlepoint.dependencies)((0, _templates.domLoader)('HandCreatorTemplate')), _dec(_class = function (_GamePanel) {
    _inherits(HandCreatorView, _GamePanel);

    /**
     * @param {DomTemplate} template
     */
    function HandCreatorView(template) {
        _classCallCheck(this, HandCreatorView);

        var _this = _possibleConstructorReturn(this, (HandCreatorView.__proto__ || Object.getPrototypeOf(HandCreatorView)).call(this, template.getRoot()));

        _this.onEditFinish = new _utils.EventEmitter();

        _this.allTiles = [];
        _this.addedSets = [];

        _this.suitGroups = _this.root.querySelector('.suitGroups');
        _this.handContents = _this.root.querySelector('.handContent');

        _this.handRevealedInput = _this.root.elements['revealed'];
        _this.isWinnerInput = _this.root.elements['isWinner'];
        _this.lastTileFromWallInput = _this.root.elements['lastTileFromWall'];
        _this.lastAvailableTileInput = _this.root.elements['lastAvailableTile'];
        _this.lastTileSpecialInput = _this.root.elements['lastTileSpecial'];

        _this.playerNameSlot = _this.root.querySelector('[data-slot="playerName"]');
        _this.roundNumberSlot = _this.root.querySelector('[data-slot="roundNumber"]');

        _this.btnFinishHand = _this.root.querySelector('[data-action="finishHand"]');

        _this.btnAddPair = _this.root.querySelector('[data-action="addPair"]');
        _this.btnAddChow = _this.root.querySelector('[data-action="addChow"]');
        _this.btnAddPung = _this.root.querySelector('[data-action="addPung"]');
        _this.btnAddKong = _this.root.querySelector('[data-action="addKong"]');
        _this.btnAddTiles = _this.root.querySelector('[data-action="addTiles"]');

        _this.root.addEventListener('submit', function (e) {
            return e.preventDefault();
        });

        _this.btnAddChow.addEventListener('click', function () {
            _this.onNewSetClicked(function (tiles) {
                if (tiles.length !== 3) {
                    return null;
                }
                return new (Function.prototype.bind.apply(_hand.Chow, [null].concat([_this.getHandRevealedValue()], _toConsumableArray(tiles))))();
            });
        });

        _this.btnAddPung.addEventListener('click', function () {
            _this.onNewSetClicked(function (tiles) {
                if (tiles.length !== 1) {
                    return null;
                }
                return new _hand.Pung(_this.getHandRevealedValue(), tiles[0]);
            });
        });

        _this.btnAddKong.addEventListener('click', function () {
            _this.onNewSetClicked(function (tiles) {
                if (tiles.length !== 1) {
                    return null;
                }
                return new _hand.Kong(_this.getHandRevealedValue(), tiles[0]);
            });
        });

        _this.btnAddPair.addEventListener('click', function () {
            _this.onNewSetClicked(function (tiles) {
                if (tiles.length !== 1) {
                    return null;
                }
                return new _hand.Pair(tiles[0]);
            });
        });

        _this.btnAddTiles.addEventListener('click', function () {
            _this.onNewSetClicked(function (tiles) {
                if (tiles.length < 1) {
                    return null;
                }
                return new _hand.FreeTiles(tiles);
            });
        });

        _this.btnFinishHand.addEventListener('click', function () {
            var tilesets = _this.addedSets.map(function (s) {
                return s.tileset;
            });
            _this.onEditFinish.emit({
                round: _this.currentEdit.round,
                player: _this.currentEdit.player,
                tilesets: tilesets,
                isWinner: _this.isWinnerInput.checked,
                lastTileFromWall: _this.lastTileFromWallInput.checked,
                lastAvailableTile: _this.lastAvailableTileInput.checked,
                lastTileSpecial: _this.lastTileSpecialInput.checked
            });
        });
        return _this;
    }

    _createClass(HandCreatorView, [{
        key: "initUI",
        value: function initUI() {
            var _this2 = this;

            [_hand.Suits.BAMBOO, _hand.Suits.CIRCLE, _hand.Suits.CHARACTER, _hand.Suits.WIND, _hand.Suits.DRAGON, _hand.Suits.BONUS].forEach(function (suitType) {
                var group = _this2.renderTileGroup(_hand.TileGroups[suitType]);

                _this2.suitGroups.appendChild(group);
            });
        }
    }, {
        key: "showHand",
        value: function showHand(round, player) {
            var _this3 = this;

            this.addedSets = [];

            this.refreshHandContent();

            var hand = round.getHand(player).hand;

            if (hand) {
                hand.sets.forEach(function (s) {
                    return _this3.renderNewTileset(s);
                });
            }

            this.roundNumberSlot.textContent = round.roundNumber;
            this.playerNameSlot.textContent = player.name;

            this.currentEdit = {
                player: player,
                round: round
            };
        }
    }, {
        key: "renderTileGroup",
        value: function renderTileGroup(tiles) {
            var _this4 = this;

            var result = document.createElement('ul');

            tiles.forEach(function (tile) {
                var tileView = new HandCreatorTileView(tile);
                _this4.allTiles.push(tileView);
                result.appendChild(tileView.view);
            });

            return result;
        }
    }, {
        key: "onNewSetClicked",
        value: function onNewSetClicked(callback) {
            var tiles = this.allTiles.filter(function (t) {
                return t.selected;
            }).map(function (t) {
                return t.tile;
            });

            var newSet = callback(tiles);

            if (newSet !== null) {
                this.renderNewTileset(newSet);
            }

            this.allTiles.forEach(function (t) {
                return t.resetSelected();
            });
        }
    }, {
        key: "renderNewTileset",
        value: function renderNewTileset(tileset) {
            var _this5 = this;

            var view = this.renderNewTiles(tileset, tileset.tiles, tileset.isRevealed);

            view.onRemove.addListener(function () {
                _this5.addedSets.splice(_this5.addedSets.indexOf(view), 1);
                _this5.refreshHandContent();
            });

            this.addedSets.push(view);
        }
    }, {
        key: "renderNewTiles",
        value: function renderNewTiles(tileset, tiles, revealed) {
            var view = new HandAddedTilesView(tileset, tiles, revealed || false);

            this.handContents.appendChild(view.view);

            return view;
        }
    }, {
        key: "refreshHandContent",
        value: function refreshHandContent() {
            var _this6 = this;

            while (this.handContents.firstChild) {
                this.handContents.removeChild(this.handContents.firstChild);
            }

            this.addedSets.forEach(function (setView) {
                _this6.handContents.appendChild(setView.view);
            });
        }
    }, {
        key: "getHandRevealedValue",
        value: function getHandRevealedValue() {
            return !!this.handRevealedInput.value;
        }
    }]);

    return HandCreatorView;
}(_gamePanel.GamePanel)) || _class);


function renderTile(tile) {
    var img = document.createElement('img');
    img.classList.add('tile');
    img.src = 'tiles/' + tile.toTypeString() + '.png';
    return img;
}

var HandCreatorTileView = function () {
    function HandCreatorTileView(tile) {
        var _this7 = this;

        _classCallCheck(this, HandCreatorTileView);

        this.tile = tile;
        this.selected = false;
        this.view = document.createElement('li');
        this.view.appendChild(renderTile(tile));

        this.view.addEventListener('click', function () {
            _this7.selected = !_this7.selected;

            _this7.view.classList.toggle('selected', _this7.selected);
        });
    }

    _createClass(HandCreatorTileView, [{
        key: "resetSelected",
        value: function resetSelected() {
            this.selected = false;
            this.view.classList.remove('selected');
        }
    }]);

    return HandCreatorTileView;
}();

var HandAddedTilesView = function HandAddedTilesView(tileset, tiles, revealed) {
    var _this8 = this;

    _classCallCheck(this, HandAddedTilesView);

    this.tiles = tiles;
    this.tileset = tileset;

    this.onRemove = new _utils.EventEmitter();
    this.view = document.createElement('ul');

    if (revealed) {
        this.view.classList.add('revealedSet');
    }

    this.tiles.forEach(function (tile) {
        var row = _this8.view.appendChild(document.createElement('li'));
        row.appendChild(renderTile(tile));
    });

    var delButton = this.view.appendChild(document.createElement('li'));
    delButton.classList.add('actionDelete');

    delButton.appendChild(document.createTextNode('X'));
    delButton.addEventListener('click', function () {
        _this8.onRemove.emit();
    });
};

exports.HandCreatorView = HandCreatorView;

},{"../hand.js":3,"../utils.js":6,"./gamePanel":8,"./templates.js":12,"needlepoint":15}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NewGameFormView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _utils = require("../utils");

var _templates = require("./templates");

var _needlepoint = require("needlepoint");

var _gamePanel = require("./gamePanel");

var _game = require("../game");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewGameFormView = exports.NewGameFormView = (_dec = (0, _needlepoint.dependencies)((0, _templates.domLoader)('NewGameTemplate')), _dec(_class = function (_GamePanel) {
    _inherits(NewGameFormView, _GamePanel);

    /**
     * @param {DomTemplate} template
     */
    function NewGameFormView(template) {
        _classCallCheck(this, NewGameFormView);

        var _this = _possibleConstructorReturn(this, (NewGameFormView.__proto__ || Object.getPrototypeOf(NewGameFormView)).call(this, template.getRoot()));

        _this.newGameCreateEvent = new _utils.EventEmitter();
        _this.cancelEvent = new _utils.EventEmitter();

        _this.form = _this.root.querySelector('form');

        _this.form.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.newGameCreateEvent.emit(_this._getPlayers());
        });

        _this.form.elements.cancel.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            _this.cancelEvent.emit();
        });
        return _this;
    }

    _createClass(NewGameFormView, [{
        key: "_getPlayers",
        value: function _getPlayers() {
            return [new _game.Player(0, this.form.elements.player1Name.value), new _game.Player(1, this.form.elements.player2Name.value), new _game.Player(2, this.form.elements.player3Name.value), new _game.Player(3, this.form.elements.player4Name.value)];
        }
    }]);

    return NewGameFormView;
}(_gamePanel.GamePanel)) || _class);

},{"../game":2,"../utils":6,"./gamePanel":8,"./templates":12,"needlepoint":15}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DomTemplate = exports.TemplateContainer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

exports.domLoader = domLoader;

var _needlepoint = require('needlepoint');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function domLoader(name) {
    return function () {
        var tmpl = _needlepoint.container.resolve(TemplateContainer);
        return new DomTemplate(tmpl.create(name));
    };
}

var TemplateContainer = exports.TemplateContainer = (0, _needlepoint.singleton)(_class = function () {
    function TemplateContainer() {
        _classCallCheck(this, TemplateContainer);

        this._templates = {};
    }

    _createClass(TemplateContainer, [{
        key: 'create',
        value: function create(name) {
            var tmpl = this._templates[name];
            return document.importNode(tmpl.content, true).firstElementChild;
        }

        /**
         * @param {HTMLElement} domTree
         */

    }, {
        key: 'discover',
        value: function discover(domTree) {
            var _this = this;

            Array.from(domTree.querySelectorAll('template')).forEach(function (tmplNode) {
                _this._templates[tmplNode.dataset.name] = tmplNode;
            });
        }
    }, {
        key: 'getTemplateNames',
        value: function getTemplateNames() {
            return Object.keys(this._templates);
        }
    }]);

    return TemplateContainer;
}()) || _class;

/**
 * @typedef {Object} TemplateSlot
 * @property {HTMLElement} node
 * @property {String} name
 */

var DomTemplate = exports.DomTemplate = function () {
    /**
     *
     * @param {HTMLElement} template
     */
    function DomTemplate(template) {
        _classCallCheck(this, DomTemplate);

        this.template = template;

        /**
         * @type {Array<TemplateSlot>}
         */
        this._slots = this._findSlots(template);
    }

    _createClass(DomTemplate, [{
        key: '_findSlots',
        value: function _findSlots(element) {
            return Array.from(element.querySelectorAll('[data-slot]')).map(function (slotNode) {
                return {
                    node: slotNode,
                    name: slotNode.dataset.slot
                };
            });
        }
    }, {
        key: 'fillSlots',
        value: function fillSlots(slotValues) {
            this._slots.forEach(function (slot) {
                if (slot.name in slotValues) {
                    slot.node.textContent = slotValues[slot.name];
                }
            });
        }

        /**
         * @return {HTMLElement}
         */

    }, {
        key: 'getRoot',
        value: function getRoot() {
            return this.template;
        }
    }]);

    return DomTemplate;
}();

},{"needlepoint":15}],13:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @package needlepoint
 * @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
 */

// Currently initialized instances for singletons
var dependencies = new Map();
var singletons = new Map();

var Container = (function () {
    function Container() {
        _classCallCheck(this, Container);
    }

    _createClass(Container, null, [{
        key: 'resolve',

        /**
         * Resolve a single class to an instance, injecting dependencies as needed
         * @param  {class|string} clazz
         * @return {object}       Instance of the class
         */
        value: function resolve(clazz) {
            clazz = Container.normalizeClass(clazz);

            // If the class being injected is a singleton, handle it separately
            // since instances of it are cached.
            if (singletons.has(clazz)) {
                return Container.resolveSingleton(clazz);
            } else {
                return Container.resolveSingleInstance(clazz);
            }
        }

        /**
         * Resolve the specified classes, injecting dependencies as needed
         * @param  {class|string} ...classes
         * @return {...object}
         */

    }, {
        key: 'resolveAll',
        value: function resolveAll() {
            for (var _len = arguments.length, classes = Array(_len), _key = 0; _key < _len; _key++) {
                classes[_key] = arguments[_key];
            }

            return classes.map(Container.resolve);
        }

        /**
         * Resolve a class into a singleton instance. This single instance will be
         * used across the entire application.
         * @param  {class|string} clazz
         * @return {object}       Resolved instance of the class as a singleton
         */

    }, {
        key: 'resolveSingleton',
        value: function resolveSingleton(clazz) {
            if (singletons.get(clazz) === null) {
                singletons.set(clazz, Container.resolveSingleInstance(clazz));
            }

            return singletons.get(clazz);
        }

        /**
         * Resolve a class into an instance with all of its dependencies injected.
         * @param  {class|string} clazz
         * @return {object}       Resolved instance of the class
         */

    }, {
        key: 'resolveSingleInstance',
        value: function resolveSingleInstance(clazz) {
            // Check and see if there are any dependencies that need to be injected
            var deps = Container.resolveAll.apply(Container, _toConsumableArray(dependencies.get(clazz) || []));

            // Apply the dependencies and create a new instance of the class
            return new (Function.prototype.bind.apply(clazz, [null].concat(_toConsumableArray(deps))))();
        }

        /**
         * Resolve a dependency into its class.
         * @param  {class|function|string} clazz
         * @return {class}
         */

    }, {
        key: 'normalizeClass',
        value: function normalizeClass(clazz) {
            if (typeof clazz == 'string') {
                // TODO: Actually resolve the class from the string name that
                // was provided to us.
            } else if (typeof clazz == 'function') {
                    return clazz;
                } else {
                    throw new Error('Unable to resolve the dependency name to the class.');
                }
        }

        /**
         * Register an instance as a singleton for the specified class
         * @param  {class|string} clazz
         * @param  {object} instance
         */

    }, {
        key: 'registerInstance',
        value: function registerInstance(clazz, instance) {
            if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) != 'object' && typeof instance != 'function') {
                throw new Error('The argument passed was an invalid type.');
            }

            clazz = Container.normalizeClass(clazz);

            singletons.set(clazz, instance);
        }

        /**
         * Register the list of dependencies required for the specified class.
         * @param  {class} clazz        Class to register dependencies for
         * @param  {array} dependencies Array of dependencies for the class
         */

    }, {
        key: 'registerDependencies',
        value: function registerDependencies(clazz, deps) {
            dependencies.set(clazz, deps);
        }

        /**
         * Register the specified class as a singleton, meaning only a single
         * instance of it will be created for the entire application.
         * @param  {class} clazz
         */

    }, {
        key: 'registerAsSingleton',
        value: function registerAsSingleton(clazz) {
            if (!singletons.has(clazz)) {
                singletons.set(clazz, null);
            }
        }
    }]);

    return Container;
})();

exports.default = Container;
},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = dependencies;

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dependencies() {
    for (var _len = arguments.length, deps = Array(_len), _key = 0; _key < _len; _key++) {
        deps[_key] = arguments[_key];
    }

    return function decorator(Clazz) {
        _container2.default.registerDependencies(Clazz, deps);
    };
} /**
   * @package needlepoint
   * @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
   */
},{"./container":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _container = require('./container');

Object.defineProperty(exports, 'container', {
  enumerable: true,
  get: function get() {
    return _container.default;
  }
});

var _singleton = require('./singleton');

Object.defineProperty(exports, 'singleton', {
  enumerable: true,
  get: function get() {
    return _singleton.default;
  }
});

var _dependencies = require('./dependencies');

Object.defineProperty(exports, 'dependencies', {
  enumerable: true,
  get: function get() {
    return _dependencies.default;
  }
});
},{"./container":13,"./dependencies":14,"./singleton":16}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = singleton;

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function singleton(Clazz) {
  _container2.default.registerAsSingleton(Clazz);
} /**
   * @package needlepoint
   * @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
   */
},{"./container":13}]},{},[4])

//# sourceMappingURL=app.js.map
