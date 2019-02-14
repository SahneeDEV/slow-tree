import 'phaser3-nineslice';
import ISaveable from '../ISaveable';
import SlowTreeGame from '../Game';
import TreeGameObject from '../gameobjects/TreeGameObject';
import BackgroundGameObject from '../gameobjects/BackgroundGameObject';
import BackgroundSkin from '../BackgroundSkin';
import MarkerGameObject from '../gameobjects/MarkerGameObject';

interface JSON {
}

export default class TreeDesignerScene extends Phaser.Scene implements ISaveable<JSON> {
    private _application!: SlowTreeGame;
    private _tree!: TreeGameObject;
    private _background!: BackgroundGameObject;

    constructor() {
        super({
            key: TreeDesignerScene.name
        });
        window.m = (x, y) => new MarkerGameObject(this, x, y)
    }

    public saveGame(): JSON {
        return {}
    }

    public loadGame(json: JSON) {
    }

    preload() {
        this._application = this.game as SlowTreeGame;
        // Test images
        this.load.image("phaser", "/assets/images/phaser.png");
        this.load.image("marker", "/assets/images/marker.png");
        // Tree images
        this.load.image("tree/trunk", "/assets/images/trunk.png");
        this.load.image("tree/branch", "/assets/images/branch.png");
        this.load.image("tree/leaves", "/assets/images/leaves.png");
        // Backgrounds
        for (const background of BackgroundSkin.ALL_BACKGROUNDS) {
            this.load.image(background.id, background.path);
        }
    }

    create() {
        this._background = new BackgroundGameObject(this);
        this._tree = new TreeGameObject(this, this.cameras.main.width / 2, this.cameras.main.height);
    }

    update(time: number, deltaTime: number) {
    }
}
