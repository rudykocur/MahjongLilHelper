

class EventEmitter {
    constructor() {
        this._listeners = [];
    }

    addListener(callback) {
        this._listeners.push(callback);
    }

    emit(...args) {
        this._listeners.forEach((callback) => {
            callback(...args);
        })
    }
}

export {EventEmitter}