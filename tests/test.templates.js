const mochaJsdom = require('mocha-jsdom');

const jsdom = require("jsdom");
const expect = require('chai').expect;

import {loadTestHtml} from "./utils";

import {DomTemplate, TemplateContainer} from '../js/view/templates';


describe('DOM: TemplateContainer tests', () => {

    mochaJsdom();

    let html;

    beforeEach(() => {
        return loadTestHtml('templates.html').then(dom => {
            html = dom.window.document.body;
        })
    });

    it('rendering rows for each round', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        expect(tmpl.getTemplateNames()).to.be.deep.equal(['template 1', 'template 2', 'template 3'])
    });

    it('filling slots', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let node = new DomTemplate(tmpl.create('template 3'));

        node.fillSlots({
            slot1: 'DAWG'
        });

        expect(node.getRoot().textContent).to.be.equal('Lorem ipsum DAWG dolor sit amet')
    });

    it('update slot second time', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let node = new DomTemplate(tmpl.create('template 3'));

        node.fillSlots({
            slot1: 'DAWG'
        });

        node.fillSlots({
            slot1: 'HELLUVA'
        });

        expect(node.getRoot().textContent).to.be.equal('Lorem ipsum HELLUVA dolor sit amet')
    })
});