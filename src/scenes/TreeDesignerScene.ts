import 'phaser3-nineslice';
import ISaveable from '@/ISaveable';
import SlowTreeGame from '@/Game';
import TreeGameObject, { JSON as TreeJSON } from '@/gameobjects/TreeGameObject';
import BackgroundGameObject from '@/gameobjects/BackgroundGameObject';
import BackgroundSkin from '@/BackgroundSkin';
import TreeType from '@/TreeType';

export interface JSON {
    version: number;
    tree: TreeJSON,
    background: string
}

export default class TreeDesignerScene extends Phaser.Scene implements ISaveable<JSON> {
    private _application!: SlowTreeGame;
    private _tree!: TreeGameObject;
    private _background!: BackgroundGameObject;
    private _version: number = 2;

    constructor() {
        super({
            key: TreeDesignerScene.name
        });
    }

    public saveGame(): JSON {
        return {
            version: this._version,
            tree: this._tree.saveGame(),
            background: this._background.backgroundImage.id
        }
    }

    public loadGame(json: JSON) {
        if (this._version != json.version) {
            throw new Error("Oops! This project file belongs to an old version of slow-tree and could not be loaded. (Project file version is " + this._version + ", the latest version is " + json.version + ")");
        }
        this._tree.loadGame(json.tree);
        this._background.backgroundImage = BackgroundSkin.byId(json.background) || BackgroundSkin.random();
  
    }

    public clear() {
        this._tree.clear();
        this._background.backgroundImage = BackgroundSkin.random();
    }

    preload() {
        this._application = this.game as SlowTreeGame;
        // Test images
        this.load.image("phaser", "/assets/images/phaser.png");
        this.load.image("marker", "/assets/images/marker.png");
        // Tree images
        for (const treeType of TreeType.ALL_TREES) {
            this.load.image(`tree/${treeType.id}/trunk`, `/assets/images/tree/${treeType.id}/trunk.png`);
            this.load.image(`tree/${treeType.id}/branch`, `/assets/images/tree/${treeType.id}/branch.png`);
            this.load.image(`tree/${treeType.id}/leaves`, `/assets/images/tree/${treeType.id}/leaves.png`);
        }
        // Backgrounds
        for (const background of BackgroundSkin.ALL_BACKGROUNDS) {
            this.load.image(background.id, background.path);
        }
    }

    create() {
        this._background = new BackgroundGameObject(this);
        this._tree = new TreeGameObject(this, this.cameras.main.width / 2, this.cameras.main.height);
        this.events.emit("scene-created", this);
    }

    update(time: number, deltaTime: number) {
        
    }

    public get tree() {
        return this._tree;
    }

    public get background() {
        return this._background;
    }
}
