import  TreeType  from "@/TreeType";
import ISaveable from "@/ISaveable";
import ITreeElement, { IBranchDetails, ILeavesDetails } from "./IBranchContainer";
import LeavesGameObject, { JSON as LeavesJSON } from "./LeavesGameObject";
import rad from "../utils/rad";

export interface JSON {
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

    constructor(scene: Phaser.Scene, details: IBranchDetails) {
        // Assign parameters.
        super(scene, BranchGameObject.name);
        this._details = details;
        this._treeType = details.treeType;

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
                x: branch.x,
                y: branch.y,
                angle: branch.angle,
                treeType: this.treeType,
                owner: this
            }).loadGame(branch);
        }
        for (let i = 0; i < json.leaves.length; i++) {
            const leaves = json.leaves[i];
            this.addLeaves({
                x: leaves.x,
                y: leaves.y,
                treeType: this.treeType,
                owner: this
            }).loadGame(leaves);
        }
    }

    public get treeType() {
        return this._treeType;
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
        return this._details.owner.baseScale;
    }

    public get scale() {
        return this._details.owner.scale * 0.85;
    }

    public get angle() {
        if (this._details.x < 0) {
            return this._details.owner.angle - this._details.angle;
        } else {
            return this._details.owner.angle + this._details.angle;
        }
    }

    public addLeaves(details: ILeavesDetails): LeavesGameObject {
        const leaves = new LeavesGameObject(this.scene, details);
        this._leavesGroup.add(leaves);
        return leaves;
    }

    public addBranch(details: IBranchDetails): BranchGameObject {
        const branch = new BranchGameObject(this.scene, details);
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
                owner: this,
                treeType: this.treeType,
                x: x,
                y: y
            });
        } else {
            this.emit("add-branch", {
                angle: 20,
                owner: this,
                treeType: this.treeType,
                x: x,
                y: y
            });
        }
    }

    private onUpdate(time: number, deltaTime: number) {
        const offsetX = this._details.owner.width * this._details.x;
        const offsetY = this._details.owner.height * this._details.y;
        const theta = rad(this._details.owner.angle);
        const rotX = offsetX * Math.cos(theta) - offsetY * Math.sin(theta);
        const rotY = offsetX * Math.sin(theta) + offsetY * Math.cos(theta);
        this._branch.setScale(this._details.owner.baseScale * this.scale);
        this._branch.setAngle(this.angle);
        this._branch.setPosition(this._details.owner.x + rotX, this._details.owner.y + rotY);
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
