import { IBranchDetails } from "./IBranchContainer";
import MarkerGameObject from "./MarkerGameObject";

/**
 * A branch of a tree.
 */
export default class BranchGameObject extends Phaser.GameObjects.GameObject {
    private _details: IBranchDetails;
    private _branch: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, details: IBranchDetails) {
        // Assign parameters.
        super(scene, BranchGameObject.name);
        this._details = details;

        // Create objects
        this._branch = this.scene.add.image(0, 0, "tree/branch");
        this._branch.setOrigin(0.5, 1);
        //this._trunk.setScale(this.baseScale);
        this._branch.setInteractive({ pixelPerfect: true });
        this._branch.setOrigin(1,0.5);
        //this._trunk.on("pointerup", this.onPointerUp);

        this.scene.events.on("update", this.onUpdate, this);
        this.scene.events.once("destroy", this.onDestroy, this);

        // Add us to the scene
        scene.add.existing(this);
    }

    private onUpdate(time: number, deltaTime: number) {
        const xOffset =this._details.owner.width * this._details.x;
        const x = this._details.owner.x - xOffset;
        let angle = 0;
        if (this._details.x < 0) {
            angle = 180 - this._details.angle;
        } else {
            angle = 0 + this._details.angle;
        }
        this._branch.setPosition(x, this._details.owner.y - this._details.owner.height * this._details.y);
        this._branch.setAngle(angle);
        new MarkerGameObject(this.scene, this._branch.x, this._branch.y);
    }

    private onDestroy() {
        this.scene.events.off("update", this.onUpdate, this, false);
    }
}
