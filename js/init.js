import {TemplateContainer} from "./view/templates";
import {Game, Player} from "./game";
import {MahjongLilHelperMainViewController} from "./app";

import {container} from 'needlepoint';

function game1() {
    let players = [
        new Player(0, "Grzesiek"),
        new Player(1, "Wojtek"),
        new Player(2, "Gosia"),
        new Player(3, "Ola"),
    ];
    let game = new Game(players[0], players[1], players[2], players[3]);

    let round1 = game.createRound();
    let round2 = game.createRound();
    let round3 = game.createRound();

    return game;
}

function game2() {
    let players = [
        new Player(0, "Grzesiek"),
        new Player(1, "Ratusz"),
        new Player(2, "Kasia"),
        new Player(3, "Ola"),
    ];
    let game = new Game(players[0], players[1], players[2], players[3]);

    let round1 = game.createRound();
    // round1.roundScores = [100, 200, 300, 400];

    // let round2 = game.createRound();
    // // round2.roundScores = [200, 100, 50, 10];
    //
    // let round3 = game.createRound();

    return game;
}

function game3() {
    let players = [
        new Player(0, "P1"),
        new Player(1, "P2"),
        new Player(2, "P3"),
        new Player(3, "P4"),
    ];
    let game = new Game(players[0], players[1], players[2], players[3]);

    // let round1 = game.createRound();

    return game;
}

document.addEventListener("DOMContentLoaded", function(event) {

    let games = [
        game1(),
        game2(),
        game3()
    ];

    let tmpl = container.resolve(TemplateContainer);
    tmpl.discover(document.body);

    let ctrl = container.resolve(MahjongLilHelperMainViewController);

    ctrl.view.mount(document.getElementById('mahjongContent'));

    ctrl.loadState(games);

    console.log('READY', ctrl);
});