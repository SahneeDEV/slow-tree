import TreeElement from "./../gameobjects/IBranchContainer";
import { ITreeElementDetails } from "@/gameobjects/IBranchContainer";
import TreeGameObject from "@/gameobjects/TreeGameObject";
import ICommand from "@/commands/ICommand";
import SlowTreeError from "@/errors/SlowTreeError";

export default class AddTreeElementCommand implements ICommand {
    constructor(private tree: TreeGameObject, private parent: string, private details: ITreeElementDetails) {
    }

    do(): void {
        const owner = this.tree.find(this.parent);
        if (owner) {
            owner.addTreeElement(this.details).id;
        }
    }

    undo(): void {
        const element = this.tree.find(this.details.id);
        if (!element) {
            throw new SlowTreeError("Could not find element with ID " + this.details.id);
        }
        element.destroy();
    }
}