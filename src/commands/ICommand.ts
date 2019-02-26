/**
 * This interfaces defines all functions a command must implement.
 */
export default interface ICommand {
    /**
     * Executes the command.
     */
    do(): void;

    /**
     * Undoes the command. Assumes that the command was executed before.
     */
    undo(): void;
}
