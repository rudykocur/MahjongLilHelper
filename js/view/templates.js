import {dependencies, singleton, container} from 'needlepoint';

export function domLoader(name) {
    return function() {
        let tmpl = container.resolve(TemplateContainer);
        return tmpl.create(name);
    }
}

@singleton
export class TemplateContainer {
    constructor() {
        this._templates = {};
    }

    /**
     * @return {DomTemplate}
     */
    create(name) {
        let tmpl = this._templates[name];
        return new DomTemplate(document.importNode(tmpl.content, true));
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


export class DomTemplate extends TemplateContainer {
    /**
     *
     * @param {HTMLElement} template
     */
    constructor(template) {
        super();

        this.template = template;
        this.root = this.template.firstElementChild;

        /**
         * @type {Array<TemplateSlot>}
         */
        this._slots = this._findSlots(template);

        this.discover(template);
    }

    _findSlots(element) {
        return Array.from(element.querySelectorAll('[data-slot]')).map(slotNode => {
            return {
                node: slotNode,
                name: slotNode.dataset.slot
            }
        })
    }

    _valueToNode(val) {
        if(val instanceof DomTemplate) {
            return val.template;
        }
        else if(typeof val === "string" || typeof val === "number") {
            return document.createTextNode(''+val);
        }
        return val;
    }

    fillSlots(slotValues) {
        this._slots.forEach(slot => {
            if(slot.name in slotValues) {
                slot.node.textContent = '';
                slot.node.appendChild(this._valueToNode(slotValues[slot.name]));
            }
        })
    }

    fillSlot(name, val) {
        this._slots.forEach(slot => {
            if (slot.name === name) {
                slot.node.textContent = '';
                slot.node.appendChild(this._valueToNode(val));
            }
        })
    }

    clearSlot(name) {
        this._slots.forEach(slot => {
            if (slot.name === name) {
                slot.node.textContent = '';
            }
        });
    }

    appendToSlot(name, value) {
        this._slots.forEach(slot => {
            if (slot.name === name) {
                slot.node.appendChild(this._valueToNode(value));
            }
        })
    }

    /**
     * @return {HTMLElement}
     */
    getRoot() {
        return this.root;
    }
}