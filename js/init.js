import {TemplateContainer} from "./view/templates";
import {Game, Player} from "./game";
import {MahjongLilHelperMainViewController} from "./app";

import {container} from 'needlepoint';

document.addEventListener("DOMContentLoaded", function(event) {
    let players = [
        new Player(0, "Grzesiek"),
        new Player(1, "Wojtek"),
        new Player(2, "Gosia"),
        new Player(3, "Ola"),
    ];
    let game = new Game(players[0], players[1], players[2], players[3]);

    let round1 = game.createRound();
    // round1.roundScores = [100, 200, 300, 400];

    let round2 = game.createRound();
    // round2.roundScores = [200, 100, 50, 10];

    let round3 = game.createRound();

    let tmpl = container.resolve(TemplateContainer);
    tmpl.discover(document.body);

    let ctrl = container.resolve(MahjongLilHelperMainViewController);

    ctrl.view.mount(document.getElementById('mahjongContent'));

    ctrl.loadState(game);

    console.log('READY', ctrl);
});