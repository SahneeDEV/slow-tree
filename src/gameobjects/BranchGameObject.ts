import IBranchContainer, { IBranchDetails, ILeavesDetails } from "./IBranchContainer";
import MarkerGameObject from "./MarkerGameObject";
import AddBranchCommand from "../commands/AddBranchCommand";
import LeavesGameObject from "./LeavesGameObject";
import AddLeavesCommand from "../commands/AddLeavesCommand";
import rad from "../utils/rad";

/**
 * A branch of a tree.
 */
export default class BranchGameObject extends Phaser.GameObjects.GameObject implements IBranchContainer {
    private _details: IBranchDetails;
    private _branch: Phaser.GameObjects.Image;
    private _branchGroup: Phaser.GameObjects.Group;
    private _leavesGroup: Phaser.GameObjects.Group;
    private _isAddingLeaves: boolean = false;

    constructor(scene: Phaser.Scene, details: IBranchDetails) {
        // Assign parameters.
        super(scene, BranchGameObject.name);
        this._details = details;

        // Create objects
        this._branch = this.scene.add.image(0, 0, "tree/branch");
        this._branch.setOrigin(1, 0.5);
        this._branch.setInteractive({ pixelPerfect: true });
        this._branch.on("pointerup", this.onPointerUp, this);
        this._branch.on("pointerdown", this.onPointerDown, this);

        this._branchGroup = this.scene.add.group();
        this._leavesGroup = this.scene.add.group();

        this.scene.events.on("update", this.onUpdate, this);
        this.scene.events.once("destroy", this.onDestroy, this);

        // Add us to the scene
        scene.add.existing(this);
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
        return this._details.angle;
    }

    public addLeaves(details: ILeavesDetails): LeavesGameObject {
        const leaves = new LeavesGameObject(this.scene, details);
        this._leavesGroup.add(leaves);
        return leaves;
    }

    public addBranch(details: IBranchDetails): BranchGameObject {
        const branch = new BranchGameObject(this.scene, details);
        this._branchGroup.add(branch);
        return branch;
    }

    private onPointerDown(e: Phaser.Input.Pointer) {
        this._isAddingLeaves = e.rightButtonDown();
    }

    private onPointerUp(e: Phaser.Input.Pointer) {
        const offsetX =  e.worldX - this.x;
        const offsetY =  e.worldY - this.y;
        const theta = rad(-this._details.angle);
        const rotX = offsetX * Math.cos(theta) - offsetY * Math.sin(theta);
        const rotY = offsetX * Math.sin(theta) + offsetY * Math.cos(theta);
        const x = rotX / this.width;
        const y = rotY / this.height;
        if (this._isAddingLeaves) {
            window.game.cmd.execute(new AddLeavesCommand({
                owner: this,
                x: x,
                y: y
            }));
        } else {
            window.game.cmd.execute(new AddBranchCommand({
                angle: this._details.angle + 20,
                owner: this,
                x: x,
                y: y
            }));
        }
    }

    private onUpdate(time: number, deltaTime: number) {
        const offsetX = this._details.owner.width * this._details.x;
        const offsetY = this._details.owner.height * this._details.y;
        const theta = rad(this._details.owner.angle);
        const rotX = offsetX * Math.cos(theta) - offsetY * Math.sin(theta);
        const rotY = offsetX * Math.sin(theta) + offsetY * Math.cos(theta);
        this._branch.setScale(this._details.owner.baseScale * this._details.owner.scale);
        this._branch.setAngle(this._details.angle);
        this._branch.setPosition(this._details.owner.x + rotX, this._details.owner.y + rotY);
    }

    private onDestroy() {
        this.scene.events.off("update", this.onUpdate, this, false);
        this._branch.off("pointerup", this.onPointerUp, this, false);
        this._branch.off("pointerdown", this.onPointerDown, this, false);
    }
}