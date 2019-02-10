import 'phaser3-nineslice';
import ISaveable from '../ISaveable';
import SlowTreeGame from '../Game';
import TreeGameObject from '../gameobjects/TreeGameObject';

interface JSON {
}

export default class TreeDesignerScene extends Phaser.Scene implements ISaveable<JSON> {
    private _application!: SlowTreeGame;
    private _tree!: TreeGameObject;

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
        // Test images
        this.load.image("phaser", "/assets/images/phaser.png");
        this.load.image("marker", "/assets/images/marker.png");
        // Tree images
        this.load.image("tree/trunk", "/assets/images/trunk.png");
        this.load.image("tree/branch", "/assets/images/branch.png");
        this.load.image("tree/leaves", "/assets/images/leaves.png");
    }

    create() {

        const phaser = this.add.sprite(100, 100, "phaser");
        phaser.setOrigin(0, 0);
        phaser.setInteractive({pixelPerfect: true})
        phaser.on("pointerup", (e: Phaser.Input.Pointer) => {
            console.log("1 ->", e)
        })

        const phaser2 = this.add.sprite(400, 400, "phaser");
        phaser2.setOrigin(0, 0);
        phaser2.setInteractive({pixelPerfect: true})
        phaser2.on("pointerup", (e: Phaser.Input.Pointer) => {
            console.log("2 ->", e)
        })

        this._tree = new TreeGameObject(this, this.cameras.main.width / 2, this.cameras.main.height);
    }

    update(time: number, deltaTime: number) {
    }
}
