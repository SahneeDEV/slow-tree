/**
 * Marks a position in the scene with a red X for three seconds.
 */
export default class MarkerGameObject extends Phaser.GameObjects.GameObject {
    private _x: number;
    private _time: number;
    private _y: number;
    private _image: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, time: number = 3000) {
        super(scene, MarkerGameObject.name);
        this._x = x;
        this._y = y;
        this._time = time;

        this.scene.events.on("update", this.onUpdate, this);
        this.once("destroy", this.onDestroy, this);

        this._image = scene.add.image(x, y, "marker");

        scene.add.existing(this);
    }

    private onDestroy() {
        this._image.destroy(true);
    }

    private onUpdate(time: number, deltaTime: number) {
        this._time -= deltaTime;
        if (this._time <= 0) {
            this.scene.events.off("update", this.onUpdate, this, false);
            this.destroy(true);
        }
    }
}