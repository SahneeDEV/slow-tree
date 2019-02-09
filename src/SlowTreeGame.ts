import Locale from './Locale';
import { Plugin as NineSlice } from 'phaser3-nineslice';
import TreeDesignerScene from './scenes/TreeDesignerScene';

/**
 * Our main game class. This is where the fun begins.
 */
export default class SlowTreeGame extends Phaser.Game {
    private _content: HTMLDivElement;
    private _locale: Locale = Locale.EN;

    constructor(content: HTMLDivElement) {
        super({
            type: Phaser.AUTO,
            parent: content.id,
            width: content.offsetWidth,
            height: content.offsetHeight,
            scene: [TreeDesignerScene],
            plugins: {
                global: [NineSlice.DefaultCfg]
            }
        });

        this.input.mouse.disableContextMenu();

        // Set variables
        this._content = content;

        // Bind methods
        this.resized = this.resized.bind(this);

        // Attach events & initialize
        window.addEventListener('resize', this.resized);
    }

    /**
     * Gets the locale of the current game.
     */
    public get locale() {
        return this._locale;
    }

    /**
     * Translates the given message. See /assets/locale for locale files.
     * @param path The path at which the message is located.
     */
    public translate(path: string | string[]): string {
        path = Array.isArray(path) ? path : path.split('.');
        let json = this.cache.json.get('locale');
        for (let i = 0; i < path.length; i++) {
            const element = path[i];
            if (json) {
                json = json[element];
            }
        }
        return typeof json === 'string' ? json : path.join('.');
    }


    /**
     * Called whenever the browser window resizes.
     */
    private resized() {
        this.resize(this._content.offsetWidth, this._content.offsetHeight);
        for (const scene of this.scene.scenes) {
            if (this.scene.isActive(scene.scene.key)) {
                this.scene.start(scene.scene.key);
            }
        }
    }
}
