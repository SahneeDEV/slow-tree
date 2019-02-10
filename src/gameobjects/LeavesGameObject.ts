import { ILeavesDetails } from "./IBranchContainer";
import MarkerGameObject from "./MarkerGameObject";
import AddBranchCommand from "../commands/AddBranchCommand";

/**
 * A branch of a tree.
 */
export default class LeavesGameObject extends Phaser.GameObjects.GameObject {
    private _details: ILeavesDetails;
    private _leaves: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, details: ILeavesDetails) {
        // Assign parameters.
        super(scene, LeavesGameObject.name);
        this._details = details;

        // Create objects
        this._leaves = this.scene.add.image(0, 0, "tree/leaves");

        this.scene.events.on("update", this.onUpdate, this);
        this.scene.events.once("destroy", this.onDestroy, this);

        // Add us to the scene
        scene.add.existing(this);
    }

    private onUpdate(time: number, deltaTime: number) {
        const xOffset = this._details.owner.width * this._details.x;
        const x = this._details.owner.x - xOffset;
        this._leaves.setPosition(x, this._details.owner.y - this._details.owner.height * this._details.y);
        this._leaves.setScale(this._details.owner.baseScale * this._details.owner.scale);
        new MarkerGameObject(this.scene, this._leaves.x, this._leaves.y);
    }

    private onDestroy() {
        this._leaves.destroy(true);
        this.scene.events.off("update", this.onUpdate, this, false);
    }
}
