import TreeType from "@/TreeType";
import BranchGameObject from "./BranchGameObject";
import LeavesGameObject from "./LeavesGameObject";

/**
 * This interface must be implemented by all objects containing branches.
 */
export default interface ITreeElement {
    /**
     * Adds a new branch to the container.
     * @param details Details about this branch
     */
    addBranch(details: IBranchDetails): BranchGameObject;
    /**
     * Adds new leaves to the container.
     * @param details Details about there leaves
     */
    addLeaves(details: ILeavesDetails): LeavesGameObject;

    /**
     * Finds the given tree element with the ID. Can find itself.
     * @param id The ID.
     * @returns The tree element or null if not found.
     */
    find(id: string): ITreeElement | null;

    /**
     * 
     */
    generateTreeElements(): ITreeElement[];

    /**
     * The type of this tree.
     */
    treeType: TreeType;

    readonly x: number;
    readonly y: number;

    readonly width: number;
    readonly height: number;

    readonly scale: number;
    readonly baseScale: number;

    readonly angle: number;

    readonly owner: ITreeElement;
    
    /**
     * The unique ID of this element.
     */
    readonly id: string;
}

/**
 * Fired whenever a branch is added.
 */
export interface IBranchDetails {
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
     * The type of this tree.
     */
    treeType: TreeType;
    /**
     * The unique ID of this element.
     */
    id: string;
}

/**
 * Fired whenever leaves are added.
 */
export interface ILeavesDetails {
    /**
     * The percentage in X the leaves were added(can be negative).
     */
    x: number;
    /**
     * The percentage in Y the leaves were added.
     */
    y: number;
    /**
     * The type of this tree.
     */
    treeType: TreeType;
    /**
     * The unique ID of this element.
     */
    id: string;
}

export interface IDetailsWithOwner {
    parent: ITreeElement;
}
