import ICommand from "./ICommand";

/**
 * This class is used to execute commands aswell as remember then in order to undo them later.
 */
export default class CommandManager {
    private _undo: ICommand[] = [];
    private _redo: ICommand[] = [];

    /**
     * Executes the given command an places it on the undo stack.
     * @param command The command.
     */
    public execute(command: ICommand) {
        this._redo = [];
        this._undo.push(command);
        console.log("Executing command", command);
        command.execute();
    }

    /**
     * Undoes the last command executed and removes it from the undo stack. If no command has 
     * been executed before no action is performed.
     * @returns The command that was undone, or `null`.
     */
    public undo(): ICommand | null {
        const command = this._undo.pop();
        if (command) {
            console.log("Undoing command", command);
            command.undo();
            this._redo.push(command);
            return command;
        } else {
            return null;
        }
    }

    /**
     * Redoes the last undone command and removes it from the redo stack. If no command has 
     * been undone before no action is performed.
     * @returns The command that was redone, or `null`.
     */
    public redo(): ICommand | null {
        const command = this._redo.pop();
        if (command) {
            console.log("Redoing command", command);
            command.execute();
            this._undo.push(command);
            return command;
        } else {
            return null;
        }
    }

    /**
     * Can we currently undo?
     */
    public get canUndo() {
        return this._undo.length !== 0;
    }

    /**
     * Can we currently redo?
     */
    public get canRedo() {
        return this._redo.length !== 0;
    }
}
