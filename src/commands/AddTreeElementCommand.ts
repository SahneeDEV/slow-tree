import TreeElement from "./../gameobjects/IBranchContainer";
import { ITreeElementDetails } from "@/gameobjects/IBranchContainer";
import TreeGameObject from "@/gameobjects/TreeGameObject";
import ICommand from "@/commands/ICommand";

export default class AddTreeElementCommand implements ICommand {
    private element: TreeElement | null = null;

    constructor(private tree: TreeGameObject, private parent: string, private details: ITreeElementDetails) {
    }

    do(): void {
        const owner = this.tree.find(this.parent);
        if (owner) {
            this.element = owner.addTreeElement(this.details);
        }
    }

    undo(): void {
        if (this.element) {
            this.element.destroy();
        }
    }
}