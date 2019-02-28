import BackgroundSkin from '@/BackgroundSkin';
import BackgroundGameObject from '@/gameobjects/BackgroundGameObject';
import ICommand from "./ICommand";

/**
 * This is demo command that serves as an example on how to use the `ICommand` interface. 
 * It allows you to change the page title and undo said action.
 */
export default class ChangeBackgroundCommand implements ICommand {
    /**
     * The background we want to change to.
     */
    private _newBackground: BackgroundSkin;

    /**
     * The background of the page used to have, saved in `execute`. null if not saved yet.
     */
    private _oldBackgroundImage: BackgroundSkin | null;

    /**
     * The background we currently have (ITS ALWAYS UPDATED!!!!)
     */  

    private _currentBackground: BackgroundGameObject;

    constructor(newBackground: BackgroundSkin, currentBackground: BackgroundGameObject) {
        this._newBackground = newBackground;
        this._oldBackgroundImage = null;
        this._currentBackground = currentBackground;

    }

    do(): void {
        // Remeber the old background so that we can restore it if required.
        this._oldBackgroundImage = this._currentBackground.backgroundImage;
        this._currentBackground.backgroundImage = this._newBackground;
    }

    undo(): void {
        // Restore the old title. If it is still null execute was not called before, 
        // we thus have nothing to undo.
        if (this._oldBackgroundImage !== null) {
            this._currentBackground.backgroundImage = this._oldBackgroundImage;
        }
    }
}