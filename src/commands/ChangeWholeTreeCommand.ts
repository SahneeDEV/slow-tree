import TreeGameObject from '@/gameobjects/TreeGameObject';
import TreeType from '@/TreeType';
import ICommand from "./ICommand";

/**
 * This is demo command that serves as an example on how to use the `ICommand` interface. 
 * It allows you to change the page title and undo said action.
 */
export default class ChangeWholeTreeCommand implements ICommand {
    /**
     * The treeType we want to change to.
     */
    private _newTreeType: TreeType;

    /**
     * The Tree we want to change.
     */
    private _tree: TreeGameObject;

    /**
     * The title the page used to have, saved in `execute`. null if not saved yet.
     */
    private _oldTreeType: {[id:string]:TreeType | undefined} = {};

    constructor(newTreeType: TreeType, tree: TreeGameObject) {
        this._newTreeType = newTreeType;
        this._tree = tree;
    }

    do(): void {
        // Remeber the old tree type so that we can restore it if required.
        this._oldTreeType = {};
        this._tree.treeType = this._newTreeType;
        let treeElements= this._tree.generateTreeElements();
        
        for (let i = 0; i < treeElements.length; i++) {
            const treeElement = treeElements[i];
            this._oldTreeType[treeElement.id] = treeElement.treeType;
            treeElement.treeType = this._newTreeType;
        }
    }

    undo(): void {
        // Restore the tree type. If it is still null execute was not called before, 
        // we thus have nothing to undo.
        let treeElements= this._tree.generateTreeElements();
        for (let i = 0; i < treeElements.length; i++) {
            const treeElement = treeElements[i];
            const treeType = this._oldTreeType[treeElement.id];

            if (treeType != undefined) {
                treeElement.treeType = treeType;
            }
        }
    }
}