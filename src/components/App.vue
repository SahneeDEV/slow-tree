<template>
  <div id="app">
    <v-app dark>
      <v-navigation-drawer app v-model="drawer" :mini-variant.sync="mini" hide-overlay stateless>
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img src="/assets/images/favicon.ico">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>slow-tree</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon @click.stop="mini = !mini">
                  <v-icon>chevron_left</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-toolbar>

        <v-divider></v-divider>

        <v-list dense class="pt-0">
          <v-list-tile v-for="item in items" :key="item.id" v-on:click.stop="onClickMenuItem(item)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app>
        <v-dialog v-model="settingsmenu" width="500">
          <v-btn slot="activator" flat>
            <v-icon>settings</v-icon>
          </v-btn>
          <v-card>
            <v-card-title class="headline" primary-title>Settings for the Tree Builder</v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 xs4>
                    <v-select
                      v-model="tree"
                      :items="trees"
                      label="Tree"
                      data-vv-name="tree"
                      v-on:change="changeTree"
                      required
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 xs4>
                    <v-select
                      v-model="background"
                      :items="backgrounds"
                      label="Background"
                      data-vv-name="background"
                      v-on:change="changeBackground"
                      required
                    ></v-select>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-slider
                      label="Angle of banches"
                      max="90"
                      min="-90"
                      thumb-label
                      v-model="angle"
                    ></v-slider>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon :disabled="!scene" flat @click.stop="onClickDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <v-btn
            icon
            :disabled="!scene"
            flat
            @click.stop="onClickBurnTree()"
            :color="burnTree ? 'red' : ''"
          >
            <v-icon>whatshot</v-icon>
          </v-btn>
          <v-menu offset-y>
            <v-btn icon flat slot="activator" :disabled="!scene">
              <v-icon>cloud_download</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click.stop="onClickDownload()">
                <v-list-tile-avatar>
                  <v-icon>file_copy</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title>Project File</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click.stop="onClickScreenshot()">
                <v-list-tile-avatar>
                  <v-icon>insert_photo</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title>Image</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-btn icon :disabled="!scene" flat @click.stop="onClickUpload()">
            <v-icon>cloud_upload</v-icon>
          </v-btn>
          <v-btn icon :disabled="!game || !game.cmd.canUndo" flat @click.stop="onClickUndo()">
            <v-icon>undo</v-icon>
          </v-btn>
          <v-btn icon :disabled="!game || !game.cmd.canRedo" flat @click.stop="onClickRedo()">
            <v-icon>redo</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <div id="game" ref="game"></div>
      </v-content>
      <v-footer app height="auto">
        <v-flex text-xs-center xs12>
          slow-tree &copy;2019 —
          <strong>sahnee.de</strong>
        </v-flex>
      </v-footer>
    </v-app>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline" primary-title>Change whole tree?</v-card-title>
        <v-card-text>
          Do you want to use the selected tree type for the whole tree?
          <br>Selecting
          <em>Yes</em> will change the whole tree to the selected type,
          <em>No</em> will only be applied to new elements.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="doChangeTree">Yes, change everything</v-btn>
          <v-btn @click="dialog = false">No, only new elements</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tutorial" width="500">
      <v-card>
        <v-card-title class="headline" primary-title>Welcome to slow-tree!</v-card-title>
        <v-card-text>
          <p>slow-tree is a web based 2D-tree creation application.</p>
          <p>
            You can create new
            <strong>branches by left-clicking/tapping</strong> on the trunk/branch. Create
            <strong>leaves by right-clicking/long-tapping</strong> on a branch.
          </p>
          <p>Delete elements by activating
            <v-icon>whatshot</v-icon>burn mode. In this mode clicking/tapping on a tree element will destroy it and its children.
          </p>
          <p>Make sure to check out the
            <v-icon>settings</v-icon>settings menu for changing the type of your tree, the angle of branches and other settings.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="doFinishTutorial">Got it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="burnTreeSnackbar"
    >Enabled burn mode, clicking on tree elements will now destroy them and all their children.</v-snackbar>

    <v-snackbar v-model="oldSavegameVersion">{{ errorMessage }}</v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "@/Game";
import TreeDesignerScene from "@/scenes/TreeDesignerScene";
import {
  IOwnedTreeElementDetails,
  IInteractEvent,
  InteractMode,
  TreeElementType
} from "@/gameobjects/IBranchContainer";
import AddTreeElementCommand from "@/commands/AddTreeElementCommand";
import ChangeBackgroundCommand from "@/commands/ChangeBackgroundCommand";
import ChangeWholeTreeCommand from "@/commands/ChangeWholeTreeCommand";
import DestroyTreeElementCommand from "@/commands/DestroyTreeElementCommand";
import Locale, { defaultLocale } from "@/Locale";
import BackgroundSkin from "@/BackgroundSkin";
import TreeType from "@/TreeType";
import uuid from "@/utils/uuid";
import LeavesGameObject from "@/gameobjects/LeavesGameObject";

interface IMenuItem {
  id: string;
  title: string;
  icon: string;
}

@Component
export default class STApp extends Vue {
  constructor() {
    super();
  }

  private locale: Locale = defaultLocale();
  private strings: {} = {};
  private game: Game | null = null;
  private scene: TreeDesignerScene | null = null;
  private items: IMenuItem[] = [
    { id: "about", title: "About", icon: "question_answer" },
    { id: "code", title: "Source Code", icon: "code" },
    { id: "privacy", title: "Privacy Policy", icon: "vpn_key" },
    { id: "tutorial", title: "Tutorial", icon: "help" }
  ];
  private tutorial: boolean = true;
  private burnTree: boolean = false;
  private burnTreeSnackbar: boolean = false;
  private right = null;
  private background: string | null = null;
  private tree: string = "broadleaf";
  private drawer = true;
  private mini = true;
  private dialog = false;
  private settingsmenu = false;
  private trees = this.getAllTrees();
  private backgrounds = this.getAllBackgrounds();
  private angle: integer = 25;
  private oldSavegameVersion: boolean = false;
  private errorMessage: string = "";

  /**
   * Called when the component is ready to be used, but has no HTMl elements yet.
   * Useful for non-visual initialization.
   */
  created() {
    this.tutorial = localStorage.getItem("tutorial") !== "true";
    fetch(`/assets/locale/${Locale[this.locale]}.json`)
      .then(data => data.json())
      .then(json => {
        console.log("Loaded locale ...", json);
        this.strings = json;
        if (this.game) {
          this.game.cache.json.add("locale", json);
        }
      });
  }

  /**
   * Called after this Vue component has been fully created, the HTML elements are
   * ready and is ready for operation.
   */
  mounted() {
    console.log("Component ready, creating game ...", this);
    // Create the Phaser game and wait for it to be ready.
    this.game = new Game(this.$refs.game as HTMLDivElement);
    this.game.events.on("ready", this.onGameReady);
    window.game = this.game;
  }

  /**
   * This is called once the Phaser game is ready to run, but no scene has been
   * loaded yet.
   */
  onGameReady() {
    console.log("Game ready, waiting for scene ...", this.game);
    // Wait for our only scene to be fully created.
    this.game!.cache.json.add("locale", this.strings);
    const scene = this.game!.scene.scenes[0] as TreeDesignerScene;
    scene.events.on("scene-created", this.onSceneReady);
  }

  /**
   * Called once the scene has been loaded and everything is ready to go. (This
   * event may be called MULTIPLE times if the window is resized and the scene
   * recreated.)
   * @param scene The scene that is ready.
   */
  onSceneReady(scene: TreeDesignerScene) {
    console.log("Scene ready, waiting for input ...", scene);
    this.scene = scene;
    // Hook up scene events
    scene.tree.on("interact", this.onTreeInteract, this);
    scene.background.on("new-background", this.onNewBackground);
    this.onNewBackground(scene.background.backgroundImage);
    // Check cache
    const cache = localStorage.getItem("cache");
    if (cache) {
      const json = JSON.parse(cache);
      try {
        scene.loadGame(json);
        this.cache();
      } catch (error) {
        this.oldSavegameVersion = true;
        localStorage.removeItem("cache");
        console.error("Failed to load savegame. Reason: " + error.message);
        this.errorMessage = error.message;
      }
    }
    //Fill the tree variable with the current tree id
    this.tree = scene.tree.treeType.id;
  }

  /**
   * Called whenever a menu item is clicked.
   * @param item The menu item.
   */
  onClickMenuItem(item: IMenuItem) {
    switch (item.id) {
      case "about": {
        window.open("https://sahnee.de/");
        break;
      }
      case "privacy": {
        window.open("https://sahnee.de/page/privacy-policy/");
        break;
      }
      case "code": {
        window.open("https://github.com/PatrickSachs/slow-tree/");
        break;
      }
      case "tutorial": {
        this.tutorial = true;
        localStorage.setItem("tutorial", "false");
        break;
      }
    }
  }

  onTreeInteract(e: IInteractEvent) {
    if (this.burnTree) {
      if (e.mode === InteractMode.PRIMARY) {
        if (e.element !== this.scene!.tree) {
          this.game!.cmd.execute(
            new DestroyTreeElementCommand(this.scene!.tree, e.element.id)
          );
        }
      }
      // todo: Can we somehow use the secondary interact mode for something here?
    } else {
      if (!(e.element instanceof LeavesGameObject)) {
        const treeType = TreeType.byId(this.tree) || TreeType.random();
        this.game!.cmd.execute(
          new AddTreeElementCommand(this.scene!.tree, e.element.id, {
            id: uuid(),
            x: e.x,
            y: e.y,
            angle: this.angle,
            treeType: treeType.id,
            elementType:
              e.mode === InteractMode.PRIMARY
                ? TreeElementType.BRANCH
                : TreeElementType.LEAVES
          })
        );
      }
    }
    this.cache();
  }

  /**
   * Called when the user clicks on the screenshot button.
   */
  onClickScreenshot() {
    if (!this.game) {
      throw new Error("No game available");
    }
    return this.game.renderer.snapshot(snap => {
      const img = snap as HTMLImageElement;
      this.download("slow-tree.png", "image/png", img.src);
      console.log("Downloaded screenshot ...", img);
    }, "image/png");
  }

  /**
   * Called when the user clicks on the download button.
   */
  onClickDownload() {
    if (!this.scene) {
      throw new Error("No scene available");
    }
    const json = JSON.stringify(this.scene.saveGame());
    this.download("slow-tree.st", "application/json", json);
    console.log("Downloaded file ...", json);
    return json;
  }

  onClickBurnTree() {
    this.burnTree = !this.burnTree;
    this.burnTreeSnackbar = this.burnTree;
  }

  download(name: string, type: string, content: string) {
    const data = content.startsWith("data:")
      ? content
      : "data:" + type + ";charset=utf-8," + encodeURIComponent(content);
    const a = document.body.appendChild(document.createElement("a"));
    a.download = name;
    a.href = data;
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Called when the user clicks on the upload button.
   */
  onClickUpload() {
    const scene = this.scene;
    if (!scene) {
      throw new Error("No scene available");
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".st";
    input.onchange = (e: Event) => {
      const el = e.target as HTMLInputElement;
      const file = el.files![0];
      const reader = new FileReader();
      reader.onload = () => {
        const json = JSON.parse(reader.result as string);
        console.log("Uploaded file ...", json);
        try {
          scene.loadGame(json);
          this.cache();
        } catch (error) {
          this.oldSavegameVersion = true;
          console.error("Failed to load savegame. Reason: " + error.message);
          this.errorMessage = error.message;
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  /**
   * Called when the user clicks on the delete button.
   */
  onClickDelete() {
    if (this.scene) {
      this.scene.clear();
      this.tree = this.scene.tree.treeType.id;
    }
    localStorage.removeItem("cache");
  }

  cache() {
    if (this.scene) {
      localStorage.setItem("cache", JSON.stringify(this.scene.saveGame()));
    }
  }

  onClickUndo() {
    const game = this.game;
    if (!game) {
      throw new Error("No game available");
    }
    game.cmd.undo();
    this.cache();
  }

  onClickRedo() {
    const game = this.game;
    if (!game) {
      throw new Error("No game available");
    }
    game.cmd.redo();
    this.cache();
  }

  getAllBackgrounds() {
    let temp: string[] = [];
    let i = 0;

    BackgroundSkin.ALL_BACKGROUNDS.forEach(element => {
      temp[i] = element.id;

      i++;
    });

    return temp;
  }

  getAllTrees() {
    let temp: string[] = [];
    let i = 0;

    TreeType.ALL_TREES.forEach(element => {
      temp[i] = element.id;

      i++;
    });

    return temp;
  }

  onNewBackground(newBackground: BackgroundSkin) {
    this.background = newBackground.id;
  }

  changeBackground() {
    if (this.scene !== null) {
      if (this.background !== null) {
        let newBackground = BackgroundSkin.byId(this.background);
        if (newBackground == null) {
          newBackground = BackgroundSkin.random();
          this.game!.cmd.execute(
            new ChangeBackgroundCommand(newBackground, this.scene.background)
          );
          this.cache();
        }
        if (newBackground !== null) {
          this.game!.cmd.execute(
            new ChangeBackgroundCommand(newBackground, this.scene.background)
          );
          this.cache();
        }
      }
    }
  }

  changeTree() {
    this.settingsmenu = false;
    this.dialog = true;
  }

  doChangeTree() {
    this.dialog = false;
    const treeType = TreeType.byId(this.tree);
    if (treeType !== null && this.scene !== null) {
      const tree = this.scene.tree;
      this.game!.cmd.execute(new ChangeWholeTreeCommand(treeType, tree));
      this.cache();
    }
  }

  /**
   * Called when the user closes the totorial.
   */
  doFinishTutorial() {
    this.tutorial = false;
    localStorage.setItem("tutorial", "true");
  }
}
</script>

<style scoped>
#game {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
</style>

<style>
html {
  user-select: none;
  overflow-y: hidden !important;
}
</style>