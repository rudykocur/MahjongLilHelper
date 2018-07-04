import {TemplateContainer} from "./view/templates";
import {Game, Player} from "./game";
import {MahjongLilHelperMainViewController} from "./app";

import {container} from 'needlepoint';

document.addEventListener("DOMContentLoaded", function(event) {

    let tmpl = container.resolve(TemplateContainer);
    tmpl.discover(document.body);

    let ctrl = container.resolve(MahjongLilHelperMainViewController);

    ctrl.view.mount(document.getElementById('mahjongContent'));

    ctrl.load();

    console.log('READY', ctrl);
});