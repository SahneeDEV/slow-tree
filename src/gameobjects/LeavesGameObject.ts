import TreeType from "@/TreeType";
import TreeElement, { ITreeElementDetails, TreeElementType, InteractMode, IInteractEvent, INTERACT_PRESS_TIME } from "./IBranchContainer";
import rad from "@/utils/rad";
import BranchGameObject from "./BranchGameObject";

export interface JSON extends ITreeElementDetails {
    angle: 0;
}

/**
 * A branch of a tree.
 */
export default class LeavesGameObject extends TreeElement<JSON> {
    /**
     * How long do we need to press to create leaves?
     */
    private static readonly LEAVES_PRESS_TIME = 300;
    private _treeType: TreeType;
    private _details: ITreeElementDetails;
    private _leaves: Phaser.GameObjects.Image;
    private _owner: TreeElement;
    /**
     * What should the user input add?
     */
    private _adding: InteractMode | null = null;
    /**
     * The time we started pressing on the game object.
     */
    private _pressTime: number = 0;

    constructor(scene: Phaser.Scene, details: ITreeElementDetails, owner: TreeElement) {
        // Assign parameters.
        super(scene, LeavesGameObject.name);
        this._details = details;
        this._treeType = TreeType.byId(details.treeType) || TreeType.BROADLEAF;
        this._owner = owner;

        // Create objects
        this._leaves = this.scene.add.image(0, 0, `tree/${this._treeType.id}/leaves`);
        this._leaves.setInteractive({ pixelPerfect: true });
        this._leaves.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);
        this._leaves.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
        this._leaves.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);

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

/**
     * Called whenever the mous eleaves the branch.
     * @param e The pointer event.
     */
    private onPointerOut(e: Phaser.Input.Pointer) {
        this._adding = null;
    }

    /**
     * This event handler is called once the user clicks down on the branch.
     * @param e The pointer event.
     */
    private onPointerDown(e: Phaser.Input.Pointer) {
        // We check for the right mouse button here instead of in the pointer up 
        // event since the mouse button has already been released in up.
        this._adding = e.rightButtonDown() ? InteractMode.SECONDARY : InteractMode.PRIMARY;
        this._pressTime = this.scene.time.now;
    }

    /**
     * This event handler is called once the user releases the click on the branch.
     * @param e The pointer event.
     */
    private onPointerUp(e: Phaser.Input.Pointer) {
        if (this._adding === null) {
            return;
        }
        // Check if we pressed long enough for adding leaves.
        if (this.scene.time.now - this._pressTime >= INTERACT_PRESS_TIME) {
            this._adding = InteractMode.SECONDARY;
        }
        // Calcuate the spawn posiion & other params.
        const offsetX = e.worldX - this.x;
        const offsetY = e.worldY - this.y;
        const theta = rad(-this.angle);
        const rotX = offsetX * Math.cos(theta) - offsetY * Math.sin(theta);
        const rotY = offsetX * Math.sin(theta) + offsetY * Math.cos(theta);
        const x = rotX / this.width;
        const y = rotY / this.height;
        // Emit either an add leaves or add branch event.
        this.emit("interact", {
            mode: this._adding,
            element: this,
            x: x,
            y: y
        } as IInteractEvent);
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
        this._leaves.destroy();
        this.scene.events.off("update", this.onUpdate, this, false);
        this._leaves.off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this, false);
        this._leaves.off(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this, false);
        this._leaves.off(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerDown, this, false);
    }
}
