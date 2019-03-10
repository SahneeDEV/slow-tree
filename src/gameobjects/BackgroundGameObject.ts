import BackgroundSkin from "../BackgroundSkin";
import cover from "../utils/cover";

export default class BackgroundGameObject extends Phaser.GameObjects.GameObject {

    private _backgroundCurrentSkin !: BackgroundSkin;
    private _backgroundImage: Phaser.GameObjects.Image | null = null;

    constructor(scene: Phaser.Scene) {
        super(scene, BackgroundGameObject.name);
        this.backgroundImage = BackgroundSkin.random();
        scene.add.existing(this);
    }


    public get backgroundImage() {
        return this._backgroundCurrentSkin
    }

    public set backgroundImage(backgroundSkin: BackgroundSkin) {

        this._backgroundCurrentSkin = backgroundSkin;

        if (this._backgroundImage != null) {
            this._backgroundImage.destroy();
        }
 
        this._backgroundImage = this.scene.add.image(0, 0, backgroundSkin.id);
        this._backgroundImage.setOrigin(0, 0);
        this._backgroundImage.setDepth(-1);
        const { width, height } = cover({ img: this._backgroundImage, container: this.scene.cameras.main });
        const scale = width > height ? (width / this._backgroundImage.width) : (height / this._backgroundImage.height);
        this._backgroundImage.setScale(scale);
        this.emit("new-background",  this._backgroundCurrentSkin)
    }

}