import { ILeavesDetails } from "./IBranchContainer";
import rad from "@/utils/rad";

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
        const offsetX = this._details.owner.width * this._details.x;
        const offsetY = this._details.owner.height * this._details.y;
        const theta = rad(this._details.owner.angle);
        const rotX = offsetX * Math.cos(theta) - offsetY * Math.sin(theta);
        const rotY = offsetX * Math.sin(theta) + offsetY * Math.cos(theta);
        this._leaves.setScale(this._details.owner.baseScale * this._details.owner.scale);
        this._leaves.setPosition(this._details.owner.x + rotX, this._details.owner.y + rotY);
    }

    private onDestroy() {
        this._leaves.destroy(true);
        this.scene.events.off("update", this.onUpdate, this, false);
    }
}
