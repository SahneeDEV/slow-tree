/**
 * Implement this interface for saveable classes.
 */
export default interface ISaveable<T extends {}> {
    /**
     * Saves the game.
     * @returns The saved JSON.
     */
    saveGame(): T;

    /**
     * Loads the game.
     * @param json The json data.
     */
    loadGame(json: T): void;
}
