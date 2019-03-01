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
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn :disabled="!scene" flat @click.stop="onClickDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <v-menu offset-y>
            <v-btn flat slot="activator" :disabled="!scene">
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
          <v-btn :disabled="!scene" flat @click.stop="onClickUpload()">
            <v-icon>cloud_upload</v-icon>
          </v-btn>
          <v-btn :disabled="!game || !game.cmd.canUndo" flat @click.stop="onClickUndo()">
            <v-icon>undo</v-icon>
          </v-btn>
          <v-btn :disabled="!game || !game.cmd.canRedo" flat @click.stop="onClickRedo()">
            <v-icon>redo</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <div id="game" ref="game"></div>
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline" primary-title>Append Tree Type?</v-card-title>
            <v-card-text>
              Do you want to use the selected Tree Type for the whole Tree?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
                <v-btn color="primary">Yes</v-btn>
                <v-btn>No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-content>
      <v-footer app></v-footer>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "@/Game";
import TreeDesignerScene from "@/scenes/TreeDesignerScene";
import {
  IBranchDetails,
  ILeavesDetails,
  IDetailsWithOwner
} from "@/gameobjects/IBranchContainer";
import AddBranchCommand from "@/commands/AddBranchCommand";
import AddLeavesCommand from "@/commands/AddLeavesCommand";
import ChangeBackgroundCommand from "@/commands/ChangeBackgroundCommand";
import Locale, { defaultLocale } from "@/Locale";
import BackgroundSkin from "@/BackgroundSkin";
import TreeType from "@/TreeType";

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
    { id: "home", title: "Home", icon: "dashboard" },
    { id: "about", title: "About", icon: "question_answer" }
  ];
  right = null;
  background: string | null = null;
  tree: string = "broadleaf";

  /**
   * Called when the component is ready to be used, but has no HTMl elements yet.
   * Useful for non-visual initialization.
   */
  created() {
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
    scene.tree.on("add-branch", this.onAddBranch);
    scene.tree.on("add-leaves", this.onAddLeaves);
    scene.background.on("new-background", this.onNewBackground)
    this.onNewBackground(scene.background.backgroundImage)
    // Check cache
    const cache = localStorage.getItem("cache");
    if (cache) {
      const json = JSON.parse(cache);
      scene.loadGame(json);
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
    }
  }

  /**
   * Called whenever a branch is left-clicked.
   */
  onAddBranch(details: IBranchDetails & IDetailsWithOwner) {
    const treeType = TreeType.byId(this.tree);
    if (treeType != null) {
       details.treeType = treeType;
    }

    this.game!.cmd.execute(
      new AddBranchCommand(this.scene!.tree, details.parent.id, details)
    );
    this.cache();
  }

  /**
   * Called whenever a branch is right-clicked.
   */
  onAddLeaves(details: ILeavesDetails & IDetailsWithOwner) {
    const treeType = TreeType.byId(this.tree);
    if (treeType != null) {
       details.treeType = treeType;
    }

    this.game!.cmd.execute(
      new AddLeavesCommand(this.scene!.tree, details.parent.id, details)
    );
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
        scene.loadGame(json);
        this.cache();
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
        let newBackground = BackgroundSkin.byId(this.background)
        if (newBackground == null) {
          newBackground = BackgroundSkin.random();
          this.game!.cmd.execute(new ChangeBackgroundCommand(newBackground, this.scene.background));
          this.cache();
        }
        if (newBackground !== null) {
          this.game!.cmd.execute(new ChangeBackgroundCommand(newBackground, this.scene.background));
          this.cache();
        }
      }
    }
    
  }

  changeTree() {
    this.settingsmenu = false;
    this.dialog = true;
  }

  drawer = true;
  mini = true;

  dialog = false;
  settingsmenu = false;

  trees = this.getAllTrees();
  backgrounds = this.getAllBackgrounds();
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