import BranchGameObject, { JSON as BranchJSON } from "./BranchGameObject";
import IBranchContainer, { IBranchDetails, ILeavesDetails } from "./IBranchContainer";
import AddBranchCommand from "../commands/AddBranchCommand";
import LeavesGameObject from "./LeavesGameObject";
import ISaveable from "@/ISaveable";

export interface JSON {
    branches: BranchJSON[];
}

/**
 * A tree in the application.
 */
export default class TreeGameObject extends Phaser.GameObjects.GameObject implements IBranchContainer, ISaveable<JSON> {
    private _trunk: Phaser.GameObjects.Image;
    private _branchGroup: Phaser.GameObjects.Group;
    private _x: number;
    private _y: number;

    saveGame(): JSON {
        return {
            branches: this._branchGroup.children.entries.map(c => {
                const branch = c as BranchGameObject;
                return branch.saveGame();
            })
        }
    }
    
    loadGame(json: JSON): void {
        throw new Error("Method not implemented.");
    }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // Assign parameters.
        super(scene, TreeGameObject.name);
        this._x = x;
        this._y = y;

        // Bind events
        this.onPointerUp = this.onPointerUp.bind(this);

        // Create objects
        this._trunk = this.scene.add.image(x, y, "tree/trunk");
        this._trunk.setOrigin(0.5, 1);
        this._trunk.setScale(this.baseScale * this.scale);
        this._trunk.setInteractive({ pixelPerfect: true });
        this._trunk.on("pointerup", this.onPointerUp);

        this._branchGroup = this.scene.add.group();

        // Add us to the scene
        scene.add.existing(this);
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

    private onPointerUp(e: Phaser.Input.Pointer) {
        const x = (e.worldX - this.x) / this.width;
        const y = (e.worldY - this.y) / this.height;
        window.game.cmd.execute(new AddBranchCommand({
            angle: 80,
            owner: this,
            x: x,
            y: y
        }));
    }

    /**
     * Adds a new branch to the tree.
     * @param details Information about the branch.
     */
    public addBranch(details: IBranchDetails): BranchGameObject {
        const branch = new BranchGameObject(this.scene, details);
        this._branchGroup.add(branch);
        return branch;
    }

    public addLeaves(details: ILeavesDetails): LeavesGameObject {
        throw new Error("Method not implemented.");
    }
}
