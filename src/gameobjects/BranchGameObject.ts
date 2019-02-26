import TreeType from "@/TreeType";
import ISaveable from "@/ISaveable";
import ITreeElement, { IBranchDetails, ILeavesDetails } from "./IBranchContainer";
import LeavesGameObject, { JSON as LeavesJSON } from "./LeavesGameObject";
import rad from "../utils/rad";
import uuid from "@/utils/uuid";

export interface JSON {
    id: string;
    x: number;
    y: number;
    angle: number;
    type: string;
    branches: JSON[];
    leaves: LeavesJSON[];
}

/**
 * A branch of a tree.
 */
export default class BranchGameObject extends Phaser.GameObjects.GameObject implements ITreeElement, ISaveable<JSON> {
    private _details: IBranchDetails;
    private _branch: Phaser.GameObjects.Image;
    private _branchGroup: Phaser.GameObjects.Group;
    private _leavesGroup: Phaser.GameObjects.Group;
    private _isAddingLeaves: boolean = false;
    private _treeType: TreeType;
    private _owner: ITreeElement;

    constructor(scene: Phaser.Scene, details: IBranchDetails, owner: ITreeElement) {
        // Assign parameters.
        super(scene, BranchGameObject.name);
        this._details = details;
        this._treeType = details.treeType;
        this._owner = owner;

        // Create objects
        this._branch = this.scene.add.image(0, 0, `tree/${this._treeType.id}/branch`);
        this._branch.setOrigin(0.5, 1);
        this._branch.setInteractive({ pixelPerfect: true });
        this._branch.on("pointerup", this.onPointerUp, this);
        this._branch.on("pointerdown", this.onPointerDown, this);

        this._branchGroup = this.scene.add.group();
        this._leavesGroup = this.scene.add.group();

        this.scene.events.on("update", this.onUpdate, this);
        this.once("destroy", this.onDestroy, this);

        // Add us to the scene
        scene.add.existing(this);
    }

    saveGame(): JSON {
        return {
            id: this._details.id,
            x: this._details.x,
            y: this._details.y,
            angle: this._details.angle,
            branches: this._branchGroup.children.entries.map(c => {
                const branch = c as BranchGameObject;
                return branch.saveGame();
            }),
            leaves: this._leavesGroup.children.entries.map(l => {
                const leaves = l as LeavesGameObject;
                return leaves.saveGame();
            }),
            type: this.treeType.id
        }
    }

    loadGame(json: JSON): void {
        for (let i = 0; i < json.branches.length; i++) {
            const branch = json.branches[i];
            this.addBranch({
                id: branch.id,
                x: branch.x,
                y: branch.y,
                angle: branch.angle,
                treeType: this.treeType
            }).loadGame(branch);
        }
        for (let i = 0; i < json.leaves.length; i++) {
            const leaves = json.leaves[i];
            this.addLeaves({
                id: leaves.id,
                x: leaves.x,
                y: leaves.y,
                treeType: this.treeType
            }).loadGame(leaves);
        }
    }

    public get treeType() {
        return this._treeType;
    }

    public set treeType(treeType: TreeType) {
        this._treeType = treeType;
        this._branch.setTexture(`tree/${this._treeType.id}/branch`);
    }

    public get x() {
        return this._branch.x;
    }

    public get y() {
        return this._branch.y;
    }

    public get width() {
        return this._branch.displayWidth;
    }

    public get height() {
        return this._branch.displayHeight;
    }

    public get baseScale() {
        return this.owner.baseScale;
    }

    public get scale() {
        return this.owner.scale * 0.85;
    }

    public get owner() {
        return this._owner;
    }

    public get id() {
        return this._details.id;
    }

    public get angle() {
        if (this._details.x < 0) {
            return this.owner.angle - this._details.angle;
        } else {
            return this.owner.angle + this._details.angle;
        }
    }

    public find(id: string): ITreeElement | null {
        if (id === this.id) {
            return this;
        }
        for (const go of this._branchGroup.children.entries) {
            const branch = go as BranchGameObject;
            const foundIt = branch.find(id);
            if (foundIt) {
                return foundIt;
            }
        }
        for (const go of this._leavesGroup.children.entries) {
            const leaves = go as LeavesGameObject;
            const foundIt = leaves.find(id);
            if (foundIt) {
                return foundIt;
            }
        }
        return null;
    }

    public addLeaves(details: ILeavesDetails): LeavesGameObject {
        const leaves = new LeavesGameObject(this.scene, details, this);
        this._leavesGroup.add(leaves);
        return leaves;
    }

    public addBranch(details: IBranchDetails): BranchGameObject {
        const branch = new BranchGameObject(this.scene, details, this);
        this._branchGroup.add(branch);
        branch.on("add-branch", (details: IBranchDetails) => {
            this.emit("add-branch", details);
        });
        branch.on("add-leaves", (details: ILeavesDetails) => {
            this.emit("add-leaves", details);
        });
        return branch;
    }

    private onPointerDown(e: Phaser.Input.Pointer) {
        this._isAddingLeaves = e.rightButtonDown();
    }

    private onPointerUp(e: Phaser.Input.Pointer) {
        const offsetX = e.worldX - this.x;
        const offsetY = e.worldY - this.y;
        const theta = rad(-this.angle);
        const rotX = offsetX * Math.cos(theta) - offsetY * Math.sin(theta);
        const rotY = offsetX * Math.sin(theta) + offsetY * Math.cos(theta);
        const x = rotX / this.width;
        const y = rotY / this.height;
        if (this._isAddingLeaves) {
            this.emit("add-leaves", {
                id: uuid(),
                parent: this,
                treeType: this.treeType,
                x: x,
                y: y
            });
        } else {
            this.emit("add-branch", {
                id: uuid(),
                parent: this,
                angle: 20,
                treeType: this.treeType,
                x: x,
                y: y
            });
        }
    }

    private onUpdate(time: number, deltaTime: number) {
        const offsetX = this.owner.width * this._details.x;
        const offsetY = this.owner.height * this._details.y;
        const theta = rad(this.owner.angle);
        const rotX = offsetX * Math.cos(theta) - offsetY * Math.sin(theta);
        const rotY = offsetX * Math.sin(theta) + offsetY * Math.cos(theta);
        this._branch.setScale(this.owner.baseScale * this.scale);
        this._branch.setAngle(this.angle);
        this._branch.setPosition(this.owner.x + rotX, this.owner.y + rotY);
    }

    private onDestroy() {
        this._branch.destroy(true);
        this._branchGroup.destroy(true);
        this._leavesGroup.destroy(true);
        this.scene.events.off("update", this.onUpdate, this, false);
        this._branch.off("pointerup", this.onPointerUp, this, false);
        this._branch.off("pointerdown", this.onPointerDown, this, false);
    }
}
