import BranchGameObject from "./BranchGameObject";

/**
 * This interface must be implemented by all objects containing branches.
 */
export default interface IBranchContainer {
    /**
     * Adds a new branch to the container.
     * @param details Details about this branch
     */
    addBranch(details: IBranchDetails): BranchGameObject;

    readonly x: number;
    readonly y: number;
    
    readonly width: number;
    readonly height: number;
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
     * The owner of the branch.
     */
    owner: IBranchContainer;
}
