import { ITreeElementDetails } from "@/gameobjects/IBranchContainer";
import ICommand from "@/commands/ICommand";
import LeavesGameObject from "@/gameobjects/LeavesGameObject";
import TreeGameObject from "@/gameobjects/TreeGameObject";

export default class AddLeavesCommand implements ICommand {
    private leaves: LeavesGameObject | null = null;

    constructor(private tree: TreeGameObject, private parent: string, private details: ITreeElementDetails) {
    }

    do(): void {
        const owner = this.tree.find(this.parent);
        if (owner) {
            this.leaves = owner.addLeaves(this.details);
        }
    }
    
    undo(): void {
        if (this.leaves) {
            this.leaves.destroy();
        }
    }
}