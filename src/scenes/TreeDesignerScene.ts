import 'phaser3-nineslice';
import ISaveable from '../ISaveable';
import SlowTreeGame from '../Game';

interface JSON {
}

export default class TreeDesignerScene extends Phaser.Scene implements ISaveable<JSON> {
    private _application!: SlowTreeGame;

    constructor() {
        super({
            key: TreeDesignerScene.name
        });
    }

    public saveGame(): JSON {
        return {}
    }

    public loadGame(json: JSON) {
    }

    preload() {
        this._application = this.game as SlowTreeGame;
    }

    create() {

    }

    update(time: number, deltaTime: number) {
    }
}
