import IBranchContainer, { IBranchDetails } from "./IBranchContainer";
import MarkerGameObject from "./MarkerGameObject";
import AddBranchCommand from "../commands/AddBranchCommand";

/**
 * A branch of a tree.
 */
export default class BranchGameObject extends Phaser.GameObjects.GameObject implements IBranchContainer {

    addBranch(details: IBranchDetails): BranchGameObject {
        const branch = new BranchGameObject(this.scene, details);
        this._branchGroup.add(branch);
        return branch;
    }

    private _details: IBranchDetails;
    private _branch: Phaser.GameObjects.Image;
    private _branchGroup: Phaser.GameObjects.Group<BranchGameObject>;

    constructor(scene: Phaser.Scene, details: IBranchDetails) {
        // Assign parameters.
        super(scene, BranchGameObject.name);
        this._details = details;

        // Create objects
        this._branch = this.scene.add.image(0, 0, "tree/branch");
        this._branch.setOrigin(0.5, 1);
        this._branch.setInteractive({ pixelPerfect: true });
        this._branch.setOrigin(1, 0.5);
        this._branch.on("pointerup", this.onPointerUp, this);

        this._branchGroup = this.scene.add.group({
            classType: BranchGameObject,
            //removeCallback: this.onRemoveBranch
        })

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
        return this._details.owner.scale - 0.1;
    }

    private onPointerUp(e: Phaser.Input.Pointer) {
        const x = (this.x - e.worldX) / this.width;
        const y = (this.y - e.worldY) / this.height;
        new MarkerGameObject(this.scene, e.worldX, e.worldY);

        window.game.cmd.execute(new AddBranchCommand({
            angle: this._details.angle + 20,
            owner: this,
            x: x,
            y: y
        }));
    }

    private onUpdate(time: number, deltaTime: number) {
        const xOffset = this._details.owner.width * this._details.x;
        const x = this._details.owner.x - xOffset;
        let angle = 0;
        if (this._details.x < 0) {
            angle = 180 - this._details.angle;
        } else {
            angle = 0 + this._details.angle;
        }
        this._branch.setPosition(x, this._details.owner.y - this._details.owner.height * this._details.y);
        this._branch.setAngle(angle);
        this._branch.setScale(this._details.owner.baseScale * this._details.owner.scale);
        new MarkerGameObject(this.scene, this._branch.x, this._branch.y);
    }

    private onDestroy() {
        this.scene.events.off("update", this.onUpdate, this, false);
    }
}
