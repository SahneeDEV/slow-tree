import TreeType from "@/TreeType";
import ITreeElement, { ITreeElementDetails, TreeElementType, IInteractEvent, InteractMode, INTERACT_PRESS_TIME } from "./IBranchContainer";
import LeavesGameObject, { JSON as LeavesJSON } from "./LeavesGameObject";
import rad from "../utils/rad";

export interface JSON extends ITreeElementDetails {
    branches: JSON[];
    leaves: LeavesJSON[];
}

/**
 * A branch of a tree.
 */
export default class BranchGameObject extends ITreeElement<JSON> {
    private _details: ITreeElementDetails;
    private _branch: Phaser.GameObjects.Image;
    private _branchGroup: Phaser.GameObjects.Group;
    private _leavesGroup: Phaser.GameObjects.Group;
    /**
     * What should the user input add?
     */
    private _adding: InteractMode | null = null;
    /**
     * The type of this element.
     */
    private _treeType: TreeType;
    /**
     * The time we started pressing on the game object. If we press for `LEAVES_PRESS_TIME` we add leaves, if not we add a branch.
     * (Leaves can also be added be right clicking, which is not affected by this property. See `_isAddingLeaves` instead)
     */
    private _pressTime: number = 0;
    /**
     * The parent element.
    */
    private _owner: ITreeElement;

    constructor(scene: Phaser.Scene, details: ITreeElementDetails, owner: ITreeElement) {
        // Assign parameters.
        super(scene, BranchGameObject.name);
        this._details = details;
        this._treeType = TreeType.byId(details.treeType) || TreeType.BROADLEAF;
        this._owner = owner;

        // Create objects
        this._branch = this.scene.add.image(0, 0, `tree/${this._treeType.id}/branch`);
        this._branch.setOrigin(0.5, 1);
        this._branch.setInteractive({ pixelPerfect: true });
        this._branch.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);
        this._branch.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
        this._branch.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);

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
            treeType: this.treeType.id,
            elementType: TreeElementType.BRANCH
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
                treeType: this.treeType.id,
                elementType: TreeElementType.BRANCH
            }).loadGame(branch);
        }
        for (let i = 0; i < json.leaves.length; i++) {
            const leaves = json.leaves[i];
            this.addLeaves({
                id: leaves.id,
                x: leaves.x,
                y: leaves.y,
                angle: 0,
                treeType: this.treeType.id,
                elementType: TreeElementType.LEAVES
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

    public get branches() {
        return this._branchGroup.children.entries as BranchGameObject[]
    }

    public get leaves() {
        return this._leavesGroup.children.entries as LeavesGameObject[]
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
    public generateTreeElements() {
        let treeElements: ITreeElement[] = [this];
        for (let i = 0; i < this.branches.length; i++) {
            const branch = this.branches[i];
            treeElements = [...treeElements, ...branch.generateTreeElements()]
        }
        for (let e = 0; e < this.leaves.length; e++) {
            const leave = this.leaves[e];
            treeElements = [...treeElements, ...leave.generateTreeElements()]
        }
        return treeElements;
    }

    public addLeaves(details: ITreeElementDetails): LeavesGameObject {
        const leaves = new LeavesGameObject(this.scene, details, this);
        this._leavesGroup.add(leaves);
        leaves.on("interact", (e: IInteractEvent) => this.emit("interact", e));
        return leaves;
    }

    public addBranch(details: ITreeElementDetails): BranchGameObject {
        const branch = new BranchGameObject(this.scene, details, this);
        this._branchGroup.add(branch);
        branch.on("interact", (e: IInteractEvent) => this.emit("interact", e));
        return branch;
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
        this._branch.setScale(this.owner.baseScale * this.scale);
        this._branch.setAngle(this.angle);
        this._branch.setPosition(this.owner.x + rotX, this.owner.y + rotY);
    }

    private onDestroy() {
        this._branch.destroy();
        this._branchGroup.destroy();
        this._leavesGroup.destroy();
        this.scene.events.off("update", this.onUpdate, this, false);
        this._branch.off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this, false);
        this._branch.off(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this, false);
        this._branch.off(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerDown, this, false);
    }
}
