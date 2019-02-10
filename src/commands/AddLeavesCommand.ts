import { ILeavesDetails } from "./../gameobjects/IBranchContainer";
import ICommand from "./ICommand";
import LeavesGameObject from "../gameobjects/LeavesGameObject";

export default class AddLeavesCommand implements ICommand {
    private _details: ILeavesDetails;
    private _leaves: LeavesGameObject | null;

    constructor(details: ILeavesDetails) {
        this._details = details;
        this._leaves = null;
    }

    execute(): void {
        this._details.owner.addLeaves(this._details);
    }
    
    undo(): void {
        if (this._leaves) {
            this._leaves.destroy(true);
        }
    }
}