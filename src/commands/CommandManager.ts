import ICommand from "./ICommand";

/**
 * This class is used to execute commands aswell as remember then in order to undo them later.
 */
export default class CommandManager {
    private _commands: ICommand[] = [];

    /**
     * Executes the given command an places it on the undo stack.
     * @param command The command.
     */
    public execute(command: ICommand) {
        this._commands.push(command);
        console.log("Executing command", command);
        command.execute();
    }

    /**
     * Undoes the last command executed and removes it from the undo stack. If no command has 
     * been executed before no action is performed.
     * @returns The command that was undone, or `null`.
     */
    public undo(): ICommand | null {
        const command = this._commands.pop();
        if (command) {
            console.log("Undoing command", command);
            command.undo();
            return command;
        } else {
            return null;
        }
    }

    public redo(): never {
        throw new Error("Not implemented");
    }
}
