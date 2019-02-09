import ICommand from "./ICommand";

/**
 * This is demo command that serves as an example on how to use the `ICommand` interface. 
 * It allows you to change the page title and undo said action.
 */
export default class DemoCommand implements ICommand {
    /**
     * The title we want to change to.
     */
    private _title: string;

    /**
     * The title the page used to have, saved in `execute`. null if not saved yet.
     */
    private _oldTitle: string | null;

    constructor(title: string) {
        this._title = title;
        this._oldTitle = null;
    }

    execute(): void {
        // Remeber the old page title so that we can restore it if required.
        this._oldTitle = document.title;
        document.title = this._title;
    }

    undo(): void {
        // Restore the old title. If it is still null execute was not called before, 
        // we thus have nothing to undo.
        if (this._oldTitle !== null) {
            document.title = this._oldTitle;
        }
    }
}