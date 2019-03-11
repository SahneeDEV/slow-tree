import TreeType from "@/TreeType";
import TreeElement, { ITreeElementDetails, TreeElementType } from "./IBranchContainer";
import rad from "@/utils/rad";
import BranchGameObject from "./BranchGameObject";

export interface JSON extends ITreeElementDetails {
    angle: 0;
}

/**
 * A branch of a tree.
 */
export default class LeavesGameObject extends TreeElement<JSON> {
    private _treeType: TreeType;
    private _details: ITreeElementDetails;
    private _leaves: Phaser.GameObjects.Image;
    private _owner: TreeElement;

    constructor(scene: Phaser.Scene, details: ITreeElementDetails, owner: TreeElement) {
        // Assign parameters.
        super(scene, LeavesGameObject.name);
        this._details = details;
        this._treeType = TreeType.byId(details.treeType) || TreeType.BROADLEAF;
        this._owner = owner;

        // Create objects
        this._leaves = this.scene.add.image(0, 0, `tree/${this._treeType.id}/leaves`);
        this._leaves.setInteractive({ pixelPerfect: true });

        this.scene.events.on("update", this.onUpdate, this);
        this.once("destroy", this.onDestroy, this);

        // Add us to the scene
        scene.add.existing(this);
    }

    public get treeType() {
        return this._treeType;
    }

    public set treeType(treeType: TreeType) {
        this._treeType = treeType;
        this._leaves.setTexture(`tree/${this._treeType.id}/leaves`);
    }

    public get angle() {
        return 0;
    }

    public get scale() {
        return this.owner.scale * 0.9;
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
        return this.owner.baseScale;
    }

    public get owner() {
        return this._owner;
    }

    public get id() {
        return this._details.id;
    }

    public find(id: string): LeavesGameObject | null {
        if (id === this.id) {
            return this;
        }
        return null;
    }
    public generateTreeElements() {
        let treeElements: TreeElement[];
        treeElements = [this];
        return treeElements;
    }

    addBranch(details: ITreeElementDetails): BranchGameObject {
        throw new Error("Not supported.");
    }

    addLeaves(details: ITreeElementDetails): LeavesGameObject {
        throw new Error("Not supported.");
    }

    saveGame(): JSON {
        return {
            id: this._details.id,
            x: this._details.x,
            y: this._details.y,
            angle: 0,
            treeType: this._treeType.id,
            elementType: TreeElementType.LEAVES
        }
    }

    loadGame(json: JSON): void {
        this.treeType = TreeType.byId(json.treeType) || TreeType.BROADLEAF;
    }

    private onUpdate(time: number, deltaTime: number) {
        const offsetX = this.owner.width * this._details.x;
        const offsetY = this.owner.height * this._details.y;
        const theta = rad(this.owner.angle);
        const rotX = offsetX * Math.cos(theta) - offsetY * Math.sin(theta);
        const rotY = offsetX * Math.sin(theta) + offsetY * Math.cos(theta);
        this._leaves.setScale(this.owner.baseScale * this.scale);
        this._leaves.setAngle(this.angle);
        this._leaves.setPosition(this.owner.x + rotX, this.owner.y + rotY);
    }

    private onDestroy() {
        this._leaves.destroy(true);
        this.scene.events.off("update", this.onUpdate, this, false);
    }
}
