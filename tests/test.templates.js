const mochaJsdom = require('mocha-jsdom');

const jsdom = require("jsdom");
const expect = require('chai').expect;

import {loadTestHtml, normalize} from "./utils";

import {DomTemplate, TemplateContainer} from '../js/view/templates';

describe('DOM: TemplateContainer tests', () => {

    mochaJsdom();

    let html;

    beforeEach(() => {
        return loadTestHtml('templates.html').then(dom => {
            html = dom.window.document.body;
        })
    });

    it('discovering templates in dom tree', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        expect(tmpl.getTemplateNames()).to.be.deep.equal(['template 1', 'template 2', 'template 3', 'template 4',
            'template 5'])
    });

    it('filling slots', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let node = tmpl.create('template 3');

        node.fillSlots({
            slot1: 'DAWG'
        });

        expect(node.getRoot().textContent.trim()).to.be.equal('Lorem ipsum DAWG dolor sit amet')
    });

    it('filling slots with another dom template', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let node = tmpl.create('template 3');

        node.fillSlots({
            slot1: tmpl.create('template 1')
        });

        expect(normalize(node.getRoot().textContent)).to.be.equal(
            'Lorem ipsum Lorem ipsum dolor sit amet 1 dolor sit amet')
    });

    it('filling slots with html element', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let node = tmpl.create('template 3');

        let newEl = document.createElement('span');
        newEl.textContent = 'SPAN DATA';

        node.fillSlots({
            slot1: newEl
        });

        expect(normalize(node.getRoot().textContent)).to.be.equal(
            'Lorem ipsum SPAN DATA dolor sit amet')
    });

    it('filling slots with text element', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let node = tmpl.create('template 3');

        let newEl = document.createTextNode('TEXT NODE');

        node.fillSlots({
            slot1: newEl
        });

        expect(normalize(node.getRoot().textContent)).to.be.equal(
            'Lorem ipsum TEXT NODE dolor sit amet')
    });

    it('update slot second time', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let node = tmpl.create('template 3');

        node.fillSlots({
            slot1: 'DAWG'
        });

        node.fillSlots({
            slot1: 'HELLUVA'
        });

        expect(node.getRoot().textContent.trim()).to.be.equal('Lorem ipsum HELLUVA dolor sit amet')
    });

    it('discovering subtemplates in template', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let template = tmpl.create('template 4');

        expect(template.getTemplateNames()).to.be.eql(['sub template 1', 'sub template 2']);
    });

    it('rendering template with subtemplates', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let template = tmpl.create('template 4');

        expect(template.getRoot().textContent.trim()).to.be.equal('Lorem FOO ipsum');
    });

    it('fill template slot with subtemplate', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let template = tmpl.create('template 4');
        let sub = template.create('sub template 1');

        template.fillSlots({slot1: sub});

        expect(template.getRoot().textContent.trim()).to.be.equal('Lorem LOL ipsum');
    });

    it('change subtemplate slot after embeding into parent', () => {
        let tmpl = new TemplateContainer();
        tmpl.discover(html);

        let template = tmpl.create('template 4');
        let sub = template.create('sub template 2');

        template.fillSlots({slot1: sub});

        expect(normalize(template.getRoot().textContent)).to.be.equal('Lorem Lorem ipsum XXX DOLOR SIT ipsum');

        sub.fillSlot('innerSlot1', 'ABC');

        expect(normalize(template.getRoot().textContent)).to.be.equal('Lorem Lorem ipsum ABC DOLOR SIT ipsum');
    });

    it('append to slot multiple subtemplates', () => {
        let container = new TemplateContainer();
        container.discover(html);

        let tmpl = container.create('template 5');
        let item1 = tmpl.create('listItem');
        let item2 = tmpl.create('listItem');

        tmpl.appendToSlot('values', item1);
        tmpl.appendToSlot('values', item2);

        item1.fillSlot('label', 'AAA');
        item2.fillSlot('label', 'BBB');

        expect(normalize(tmpl.getRoot().textContent)).to.be.equal('LIST: AAABBB');
    });


});

describe('DOM: TemplateContainer with tables', () => {

    mochaJsdom();

    let html;

    beforeEach(() => {
        return loadTestHtml('templatesForTable.html').then(dom => {
            html = dom.window.document.body;
        })
    });

    it('append multiple table rows as subtemplates into table slot', () => {
        let container = new TemplateContainer();
        container.discover(html);

        let tmpl = container.create('tableTemplate');

        let row1 = tmpl.create('row');
        row1.fillSlots({
            slot1: 'XX',
            slot2: 'YY'
        });

        let row2 = tmpl.create('row');
        row2.fillSlots({
            slot1: 'AA',
            slot2: 'BB'
        });

        tmpl.appendToSlot('rows', row1);
        tmpl.appendToSlot('rows', row2);

        expect(normalize(tmpl.getRoot().textContent)).to.be.equal(
            'Head 1 Head 2 CONSTANT 1 XX YY XX CONSTANT 1 AA BB AA');
    })
});