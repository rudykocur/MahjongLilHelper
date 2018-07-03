const jsdom = require("jsdom");

export class HTMLDriver {
    /**
     * @param {JSDOM} dom
     */
    constructor(dom) {
        /**
         * @type HTMLElement
         */
        this.root = dom.window.document.body;
    }

    _fireEvent(selectorOrElement, eventName) {
        let element;

        if(typeof selectorOrElement === 'string') {
            element = this.root.querySelector(selectorOrElement);
        }
        else {
            element = selectorOrElement
        }
        let evt = element.ownerDocument.createEvent("HTMLEvents");
        evt.initEvent(eventName, true, true);
        element.dispatchEvent(evt)
    }

    _setRadio(form, name, value) {
        form.elements[name].value = value;
    }

    click(selectorOrElement) {
        this._fireEvent(selectorOrElement, 'click');
    }
}

export function loadTemplateHtml(fileName) {
    return jsdom.JSDOM.fromFile(`./templates/${fileName}`)
}

export function loadTestHtml(fileName) {
    return jsdom.JSDOM.fromFile(`./tests/test_html/${fileName}`)
}