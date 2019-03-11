import { ITreeElementDetails } from "@/gameobjects/IBranchContainer";
import ISaveable from "@/ISaveable";
import TreeType from "@/TreeType";
import BranchGameObject from "./BranchGameObject";
import LeavesGameObject from "./LeavesGameObject";
import SlowTreeError from "@/errors/SlowTreeError";

/**
 * This interface must be implemented by all objects containing branches.
 */
abstract class TreeElement<T extends ITreeElementDetails = ITreeElementDetails> extends Phaser.GameObjects.GameObject implements ISaveable<T> {
    /**
     * Adds the given tree element details.
     * @param details The details.
     */
    public addTreeElement(details: ITreeElementDetails): TreeElement {
        switch(details.elementType) {
            case TreeElementType.BRANCH: return this.addBranch(details);
            case TreeElementType.LEAVES: return this.addLeaves(details);
            default: throw new SlowTreeError("Cannot add element type " + details.elementType);
        }
    }

    /**
     * Adds a new branch to the container.
     * @param details Details about this branch
     */
    abstract addBranch(details: ITreeElementDetails): BranchGameObject;
    /**
     * Adds new leaves to the container.
     * @param details Details about there leaves
     */
    abstract addLeaves(details: ITreeElementDetails): LeavesGameObject;

    /**
     * Finds the given tree element with the ID. Can find itself.
     * @param id The ID.
     * @returns The tree element or null if not found.
     */
    abstract find(id: string): TreeElement | null;

    /**
     * Gets all child elements and the element itself.
     * @returns All elements.
     */
    abstract generateTreeElements(): TreeElement[];

    /**
     * The type of this tree.
     */
    abstract treeType: TreeType;

    abstract readonly x: number;
    abstract readonly y: number;

    abstract readonly width: number;
    abstract readonly height: number;

    abstract readonly scale: number;
    abstract readonly baseScale: number;

    abstract readonly angle: number;

    abstract readonly owner: TreeElement;

    /**
     * The unique ID of this element.
     */
    abstract readonly id: string;

    abstract saveGame(): T;
    abstract loadGame(json: T): void;
}

/**
 * What type of tree element is something?
 */
export enum TreeElementType {
    /**
     * Its a trunk.
     */
    TRUNK,
    /**
     * Its a branch.
     */
    BRANCH,
    /**
     * Its a leaf.
     */
    LEAVES
}

export interface ITreeElementDetails {
    /**
     * The percentage in X the branch was added(can be negative).
     */
    x: number;
    /**
     * The percentage in Y the branch was added.
     */
    y: number;
    /**
     * The euler angles in which the branch was added.
     */
    angle: number;
    /**
     * The type of this tree. (Use the TreeType class to get the actual type)
     * Saved as a string to be save game compatible.
     */
    treeType: string;
    /**
     * The element type. Is it a branch, etc...
     */
    elementType: TreeElementType;
    /**
     * The unique ID of this element.
     */
    id: string;
}

export interface IOwnedTreeElementDetails extends ITreeElementDetails {
    parent: TreeElement;
}

export default TreeElement;
