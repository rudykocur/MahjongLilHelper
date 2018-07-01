import {dependencies, singleton, container} from 'needlepoint';

export function domLoader(name) {
    return function() {
        let tmpl = container.resolve(TemplateContainer);
        return new DomTemplate(name, tmpl);
    }
}

@singleton
export class TemplateContainer {
    constructor() {
        this._templates = {};
    }

    create(name) {
        let tmpl = this._templates[name];
        return document.importNode(tmpl.content, true).firstElementChild;
    }

    /**
     * @param {HTMLElement} domTree
     */
    discover(domTree) {
        Array.from(domTree.querySelectorAll('template')).forEach(tmplNode => {
            this._templates[tmplNode.dataset.name] = tmplNode;
        });
    }
}

export class DomTemplate {
    /**
     *
     * @param {String} name
     * @param {TemplateContainer} templates
     */
    constructor(name, templates) {
        this.name = name;
        this.templates = templates;
    }

    /**
     * @return {HTMLElement}
     */
    clone() {
        return this.templates.create(this.name);
    }
}