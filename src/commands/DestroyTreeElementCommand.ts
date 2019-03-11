import { ITreeElementDetails } from "./../gameobjects/IBranchContainer";
import TreeGameObject from "@/gameobjects/TreeGameObject";
import ICommand from "@/commands/ICommand";
import SlowTreeError from "@/errors/SlowTreeError";

/**
 * This command destroys the given tree element.
 */
export default class DestroyTreeElementCommand implements ICommand {
    constructor(private tree: TreeGameObject, private element: string) { }

    /**
     * The saved version of the destoryed children.
     */
    private children: ITreeElementDetails | null = null;
    /**
     * The saved ID of the old owner.
     */
    private owner: string | null = null;

    do(): void {
        const element = this.tree.find(this.element);
        if (!element) {
            throw new SlowTreeError("Could not delete tree element with ID " + this.element);
        }
        // Save the data
        this.owner = element.owner.id;
        this.children = element.saveGame();
        // And destroy all children.
        const toDestroy = element.generateTreeElements();
        for (let i = 0; i < toDestroy.length; i++) {
            const destroy = toDestroy[i];
            destroy.destroy();
        }
    }

    undo(): void {
        if (this.owner && this.children) {
            const owner = this.tree.find(this.owner);
            if (!owner) {
                throw new SlowTreeError("Could not un-delete tree element with owner " + this.owner);
            }
            // A kinda hacky workaround leveraging the fact that the save data strcuture is the
            // same as the one used in game.
            // For a larger project a better solution might be warraned, but in this case it does 
            // the job just fine.
            owner.addTreeElement(this.children).loadGame(this.children);
        }
    }
}
