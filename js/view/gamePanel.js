

export class GamePanel {
    constructor(root) {
        this.root = root;
    }

    show() {
        this.root.classList.remove('hidden');
    }

    hide() {
        this.root.classList.add('hidden');
    }
}