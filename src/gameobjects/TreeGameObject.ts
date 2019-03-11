import TreeType from "@/TreeType";
import BranchGameObject, { JSON as BranchJSON } from "./BranchGameObject";
import ITreeElement, { ITreeElementDetails, TreeElementType, IInteractEvent, InteractMode } from "./IBranchContainer";
import LeavesGameObject from "./LeavesGameObject";
import uuid from "@/utils/uuid";

export interface JSON extends ITreeElementDetails {
    id: "tree";
    branches: BranchJSON[];
    angle: 0;
    x: 0;
    y: 0;
}

/**
 * A tree in the application.
 */
export default class TreeGameObject extends ITreeElement<JSON> {
    private _trunk!: Phaser.GameObjects.Image;
    private _branchGroup: Phaser.GameObjects.Group;
    private _x: number;
    private _y: number;
    private _treeType: TreeType = TreeType.random();

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // Assign parameters.
        super(scene, TreeGameObject.name);
        this._x = x;
        this._y = y;

        // Create objects
        this._trunk = this.scene.add.image(this._x, this._y, `tree/${this.treeType.id}/trunk`);
        this._trunk.setOrigin(0.5, 1);
        this._trunk.setScale(this.baseScale * this.scale);
        this._trunk.setInteractive({ pixelPerfect: true });
        this._trunk.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
        this.treeType = this._treeType;
        this.once(Phaser.GameObjects.Events.DESTROY, this.onDestroy, this);

        this._branchGroup = this.scene.add.group();

        // Add us to the scene
        scene.add.existing(this);
    }

    public clear() {
        this.treeType = TreeType.random();
        this._branchGroup.clear(true, true);
    }

    saveGame(): JSON {
        return {
            id: "tree",
            branches: this._branchGroup.children.entries.map(c => {
                const branch = c as BranchGameObject;
                return branch.saveGame();
            }),
            angle: 0,
            x: 0,
            y: 0,
            treeType: this.treeType.id,
            elementType: TreeElementType.TRUNK
        }
    }

    loadGame(json: JSON): void {
        this._branchGroup.clear(true, true);
        this.treeType = TreeType.byId(json.treeType) || TreeType.BROADLEAF;
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
    }

    public get treeType() {
        return this._treeType;
    }

    public set treeType(type: TreeType) {
        this._treeType = type;
        this._trunk.setTexture(`tree/${this.treeType.id}/trunk`)
    }

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public get width() {
        return this._trunk.displayWidth;
    }

    public get height() {
        return this._trunk.displayHeight;
    }

    public get angle() {
        return 0;
    }

    /**
     * This is the scale the tree has a full size.
     */
    public get baseScale() {
        return (this._y / this._trunk.height) * 0.75;
    }

    public get scale() {
        return 1;
    }

    public get owner() {
        return this;
    }

    public get id() {
        return "root";
    }

    public get branches() {
        return this._branchGroup.children.entries as BranchGameObject[]
    }

    public find(id: string): ITreeElement | null {
        if (id === this.id) {
            return this;
        }
        // The find function is deeply recursive. Prepare for oblivion!
        for (const go of this._branchGroup.children.entries) {
            const branch = go as BranchGameObject;
            const foundIt = branch.find(id);
            if (foundIt) {
                return foundIt;
            }
        }
        return null;
    }

    private onPointerUp(e: Phaser.Input.Pointer) {
        const x = (e.worldX - this.x) / this.width;
        const y = (e.worldY - this.y) / this.height;
        this.emit("interact", {
            mode: InteractMode.PRIMARY,
            element: this,
            x: x,
            y: y
        } as IInteractEvent);
    }

    private onDestroy() {
        this._trunk.destroy(true);
        this._branchGroup.destroy(true);
        this._trunk.off(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
    }

    /**
     * Adds a new branch to the tree.
     * @param details Information about the branch.
     */
    public addBranch(details: ITreeElementDetails): BranchGameObject {
        const branch = new BranchGameObject(this.scene, details, this);
        this._branchGroup.add(branch);
        branch.on("interact", (e: IInteractEvent) => this.emit("interact", e));
        return branch;
    }

    public addLeaves(details: ITreeElementDetails): LeavesGameObject {
        throw new Error("Method not implemented.");
    }

    public generateTreeElements() {
        let treeElements: ITreeElement[] = [this];
        for (let i = 0; i < this.branches.length; i++) {
            const branch = this.branches[i];
            treeElements = [...treeElements, ...branch.generateTreeElements()]
        }
        return treeElements;
    }
}
