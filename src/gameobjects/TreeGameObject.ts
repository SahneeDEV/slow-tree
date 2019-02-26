import TreeType from "@/TreeType";
import BranchGameObject, { JSON as BranchJSON } from "./BranchGameObject";
import ITreeElement, { IBranchDetails, ILeavesDetails } from "./IBranchContainer";
import LeavesGameObject from "./LeavesGameObject";
import ISaveable from "@/ISaveable";
import uuid from "@/utils/uuid";

export interface JSON {
    branches: BranchJSON[];
    type: string;
}

/**
 * A tree in the application.
 */
export default class TreeGameObject extends Phaser.GameObjects.GameObject implements ITreeElement, ISaveable<JSON> {
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
            branches: this._branchGroup.children.entries.map(c => {
                const branch = c as BranchGameObject;
                return branch.saveGame();
            }),
            type: this.treeType.id
        }
    }

    loadGame(json: JSON): void {
        this._branchGroup.clear(true, true);
        this.treeType = TreeType.byId(json.type) || TreeType.BROADLEAF;
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
        this.emit("add-branch", {
            id: uuid(),
            parent: this,
            angle: 80,
            treeType: this.treeType,
            x: x,
            y: y
        });
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

    public addLeaves(details: ILeavesDetails): LeavesGameObject {
        throw new Error("Method not implemented.");
    }
}
