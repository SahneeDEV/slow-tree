import { ITreeElementDetails } from "./../gameobjects/IBranchContainer";
import TreeGameObject from "@/gameobjects/TreeGameObject";
import ICommand from "@/commands/ICommand";
import SlowTreeError from "@/errors/SlowTreeError";

export default class DestroyTreeElementCommand implements ICommand {
    constructor(private tree: TreeGameObject, private element: string) {

    }

    private children: ITreeElementDetails | null = null;
    private owner: string | null = null;

    do(): void {
        const element = this.tree.find(this.element);
        if (!element) {
            throw new SlowTreeError("Could not delete tree element with ID " + this.element);
        }
        this.owner = element.owner.id;
        this.children = element.saveGame();
        const toDestroy = element.generateTreeElements();
        for (let i = 0; i < toDestroy.length; i++) {
            const destroy = toDestroy[i];
            destroy.destroy();
        }

        console.log(this.owner, this.children);
    }

    undo(): void {
        if (this.owner && this.children) {
            const owner = this.tree.find(this.owner);
            if (!owner) {
                throw new SlowTreeError("Could not un-delete tree element with owner " + this.owner);
            }
            owner.addTreeElement(this.children).loadGame(this.children);
        }
    }


}