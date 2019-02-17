/**
 * An application background.
 */
export default class BackgroundSkin {
    public static readonly TYLER_LASTOVICH = new BackgroundSkin("tyler-lastovich", "tyler-lastovich.jpg");
    public static readonly BRIGHT_DAYLIGHT = new BackgroundSkin("bright-daylight", "bright-daylight.jpg");
    public static readonly ARCH_BRIDGE = new BackgroundSkin("arch-bridge", "arch-bridge.jpg");

    public static readonly ALL_BACKGROUNDS = [BackgroundSkin.TYLER_LASTOVICH, BackgroundSkin.BRIGHT_DAYLIGHT, BackgroundSkin.ARCH_BRIDGE];

    public static random() {
        return BackgroundSkin.ALL_BACKGROUNDS[Math.round(Math.random() * (BackgroundSkin.ALL_BACKGROUNDS.length - 1))]
    }

    private _id: string;
    private _path: string;

    constructor(id: string, filename: string) {
        this._id = id;
        this._path = "/assets/images/background/" + filename;
    }

    /**
     * Gets the ID of this skin.
     */
    public get id() {
        return this._id;
    }

    /**
     * Gives back the background to a given id
     * @param id The ID of the background.
     * @returns The background , or null if no background with the given ID could be found.
     */
    public static byId(id: string) {
        for (let i = 0; i < BackgroundSkin.ALL_BACKGROUNDS.length; i++) {
            const background = BackgroundSkin.ALL_BACKGROUNDS[i];
            if (background.id === id) {
                return background;
            }
        }
        return null;
    }

    /**
     * Gets the back for this background skin.
     */
    public get path() {
        return this._path;
    }
}
