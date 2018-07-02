import {DomTemplate} from "../js/view/templates";

const mochaJsdom = require('mocha-jsdom');
import {Player} from "../js/game";

const jsdom = require("jsdom");
const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').use(require('sinon-chai'));

import {loadTestHtml} from "./utils";

import {NewGameFormView} from "../js/view/newGameForm";
import {NewGameViewDriver} from "./drivers/driver.newGame";

describe('DOM: new game form', () => {

    mochaJsdom();
    let /*NewGameViewDriver*/driver, /*DomTemplate*/tmpl;

    beforeEach(() => {
        return loadTestHtml('newGameForm.html').then((dom) => {
            driver = new NewGameViewDriver(dom);
            tmpl = new DomTemplate(driver.root);
        })
    });

    /**
     * @return {NewGameFormView}
     */
    function initDefaultView() {
        let view = new NewGameFormView(tmpl);

        return view;
    }

    it('Triggering newGameCreateEvent', () => {
        let view = initDefaultView();

        let cancelCallback = sinon.spy();
        let newGameCallback = sinon.spy();

        view.newGameCreateEvent.addListener(newGameCallback);
        view.cancelEvent.addListener(cancelCallback);

        driver.fillPlayer(0, 'Janek');
        driver.fillPlayer(1, 'Helga');
        driver.fillPlayer(2, 'Zenek');
        driver.fillPlayer(3, 'Mietek');

        driver.clickAdd();

        expect(newGameCallback).calledWithExactly([
            new Player(0, 'Janek'),
            new Player(1, 'Helga'),
            new Player(2, 'Zenek'),
            new Player(3, 'Mietek'),
        ]);

        expect(cancelCallback).not.called;
    });

    it('Triggering cancelEvent', () => {
        let view = initDefaultView();

        let cancelCallback = sinon.spy();
        let newGameCallback = sinon.spy();

        view.newGameCreateEvent.addListener(newGameCallback);
        view.cancelEvent.addListener(cancelCallback);

        driver.clickCancel();

        expect(newGameCallback).not.called;
        expect(cancelCallback).calledOnce;
    });
});