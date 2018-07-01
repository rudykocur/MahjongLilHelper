import {dependencies, singleton, container} from 'needlepoint';

export function domLoader(name) {
    return function() {
        let tmpl = container.resolve(TemplateContainer);
        return new DomTemplate(tmpl.create(name));
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

    getTemplateNames() {
        return Object.keys(this._templates);
    }
}

/**
 * @typedef {Object} TemplateSlot
 * @property {HTMLElement} node
 * @property {String} name
 */


export class DomTemplate {
    /**
     *
     * @param {HTMLElement} template
     */
    constructor(template) {
        this.template = template;

        /**
         * @type {Array<TemplateSlot>}
         */
        this._slots = this._findSlots(template);
    }

    _findSlots(element) {
        return Array.from(element.querySelectorAll('[data-slot]')).map(slotNode => {
            return {
                node: slotNode,
                name: slotNode.dataset.slot
            }
        })
    }

    fillSlots(slotValues) {
        this._slots.forEach(slot => {
            if(slot.name in slotValues) {
                slot.node.textContent = slotValues[slot.name];
            }
        })
    }

    /**
     * @return {HTMLElement}
     */
    getRoot() {
        return this.template;
    }
}