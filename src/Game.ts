import { Plugin as NineSlice } from 'phaser3-nineslice';
import TreeDesignerScene from './scenes/TreeDesignerScene';
import CommandManager from './commands/CommandManager';

/**
 * Our main game class. This is where the fun begins.
 */
export default class SlowTreeGame extends Phaser.Game {
    private _content: HTMLDivElement;
    private _cmd: CommandManager;

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
        this._cmd = new CommandManager();

        // Set variables
        this._content = content;

        // Bind methods
        this.resized = this.resized.bind(this);

        // Attach events & initialize
        window.addEventListener('resize', this.resized);
    }

    public get cmd() {
        return this._cmd;
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

    public get activeScene(): Phaser.Scene | null {
        for (const scene of this.scene.scenes) {
            if (this.scene.isActive(scene.scene.key)) {
                return scene;
            }
        }
        return null;
    }


    /**
     * Called whenever the browser window resizes.
     */
    private resized() {
        this.scale.resize(this._content.offsetWidth, this._content.offsetHeight);
        if (this.activeScene) {
            this.scene.start(this.activeScene.scene.key);
        }
    }
}
