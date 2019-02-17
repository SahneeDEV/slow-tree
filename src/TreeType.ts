/**
 * Defines a tree type in the game.
 */
export default class TreeType {
    public static readonly CONIFER = new TreeType("conifer");
    public static readonly BROADLEAF = new TreeType("broadleaf");
    public static readonly SAKURA = new TreeType("sakura");

    public static readonly ALL_TREES = [TreeType.CONIFER, TreeType.BROADLEAF, TreeType.SAKURA];

    public static random() {
        return TreeType.ALL_TREES[Math.round(Math.random() * (TreeType.ALL_TREES.length - 1))]
    }

    /**
     * Finds a tree type by the given ID.
     * @param id The ID of the tree type to find.
     * @returns The tree type, or null if no tree type could be found.
     */
    public static byId(id: string) {
        for (const type of TreeType.ALL_TREES) {
            if (type.id === id) {
                return type;
            }
        }
        return null;
    }

    private _id: string;

    constructor(id: string) {
        this._id = id;
    }

    /**
     * Gets the ID of this tree type.
     */
    public get id() {
        return this._id;
    }
}
