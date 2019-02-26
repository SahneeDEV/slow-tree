import { IBranchDetails } from "@/gameobjects/IBranchContainer";
import BranchGameObject from "@/gameobjects/BranchGameObject";
import TreeGameObject from "@/gameobjects/TreeGameObject";
import ICommand from "@/commands/ICommand";

export default class AddBranchCommand implements ICommand {
    private branch: BranchGameObject | null = null;

    constructor(private tree: TreeGameObject, private parent: string, private details: IBranchDetails) {
    }

    do(): void {
        const owner = this.tree.find(this.parent);
        console.log("owner is", this.details.id, owner)
        if (owner) {
            this.branch = owner.addBranch(this.details);
        }
    }

    undo(): void {
        if (this.branch) {
            this.branch.destroy();
        }
    }
}