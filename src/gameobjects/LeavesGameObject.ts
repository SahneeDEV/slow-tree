import TreeType from "@/TreeType";
import ISaveable from "@/ISaveable";
import ITreeElement, { ILeavesDetails, IBranchDetails } from "./IBranchContainer";
import rad from "@/utils/rad";
import BranchGameObject from "./BranchGameObject";

export interface JSON {
    x: number;
    y: number;
    type: string;
}

/**
 * A branch of a tree.
 */
export default class LeavesGameObject extends Phaser.GameObjects.GameObject implements ITreeElement, ISaveable<JSON> {
    private _treeType: TreeType;
    private _details: ILeavesDetails;
    private _leaves: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, details: ILeavesDetails) {
        // Assign parameters.
        super(scene, LeavesGameObject.name);
        this._details = details;
        this._treeType = details.treeType;

        // Create objects
        this._leaves = this.scene.add.image(0, 0, `tree/${this._treeType.id}/leaves`);
        this._leaves.setInteractive({ pixelPerfect: true });

        this.scene.events.on("update", this.onUpdate, this);
        this.scene.events.once("destroy", this.onDestroy, this);

        // Add us to the scene
        scene.add.existing(this);
    }

    public get treeType() {
        return this._treeType;
    }

    public get angle() {
        return 0;
    }

    public get scale() {
        return this._details.owner.scale * 0.9;
    }

    public get x() {
        return this._leaves.x;
    }

    public get y() {
        return this._leaves.y;
    }

    public get width() {
        return this._leaves.displayWidth;
    }

    public get height() {
        return this._leaves.displayHeight;
    }

    public get baseScale() {
        return this._details.owner.baseScale;
    }

    addBranch(details: IBranchDetails): BranchGameObject {
        throw new Error("Not supported.");
    }

    addLeaves(details: ILeavesDetails): LeavesGameObject {
        throw new Error("Method not implemented.");
    }

    saveGame(): JSON {
        return {
            x: this._details.x,
            y: this._details.y,
            type: this._treeType.id
        }
    }

    loadGame(json: JSON): void {
        this._treeType = TreeType.byId(json.type) || TreeType.BROADLEAF;
    }

    private onUpdate(time: number, deltaTime: number) {
        const offsetX = this._details.owner.width * this._details.x;
        const offsetY = this._details.owner.height * this._details.y;
        const theta = rad(this._details.owner.angle);
        const rotX = offsetX * Math.cos(theta) - offsetY * Math.sin(theta);
        const rotY = offsetX * Math.sin(theta) + offsetY * Math.cos(theta);
        this._leaves.setScale(this._details.owner.baseScale * this.scale);
        this._leaves.setAngle(this.angle);
        this._leaves.setPosition(this._details.owner.x + rotX, this._details.owner.y + rotY);
    }

    private onDestroy() {
        this._leaves.destroy(true);
        this.scene.events.off("update", this.onUpdate, this, false);
    }
}
