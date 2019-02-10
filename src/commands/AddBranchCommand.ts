import { IBranchDetails } from "./../gameobjects/IBranchContainer";
import ICommand from "./ICommand";
import BranchGameObject from "../gameobjects/BranchGameObject";

export default class AddBranchCommand implements ICommand {
    private _details: IBranchDetails;
    private _branch: BranchGameObject | null;

    constructor(details: IBranchDetails) {
        this._details = details;
        this._branch = null;
    }

    execute(): void {
        this._details.owner.addBranch(this._details);
    }
    
    undo(): void {
        if (this._branch) {
            this._branch.destroy(true);
        }
    }
}