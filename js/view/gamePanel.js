

export class GamePanel {
    constructor(root) {
        this.root = root;

        this.root.classList.add('gamePanel');
    }

    getRoot() {
        return this.root;
    }

    show() {
        this.root.classList.remove('hidden');
    }

    hide() {
        this.root.classList.add('hidden');
    }
}