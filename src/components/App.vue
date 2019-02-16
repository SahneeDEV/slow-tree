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
          <v-list-tile v-for="item in items" :key="item.title">
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
        <v-toolbar-side-icon @click.stop="mini = !mini"></v-toolbar-side-icon>
        <v-dialog v-model="dialog" width="500">
          <v-btn slot="activator" dark>
            <v-icon>settings</v-icon>
          </v-btn>
          <v-card>
            <v-card-title dark class="headline" primary-title>Settings for the Tree Builder</v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 xs4>
                    <v-select
                      v-model="tree"
                      :items="trees"
                      label="Tree"
                      data-vv-name="tree"
                      required
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 xs4>
                    <v-select
                      v-model="leaf"
                      :items="leaves"
                      label="Leaf"
                      data-vv-name="leaf"
                      required
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 xs4>
                    <v-select
                      v-model="background"
                      :items="backgrounds"
                      label="Background"
                      data-vv-name="background"
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
          <v-btn flat>
            <v-icon>create</v-icon>
          </v-btn>
          <v-btn :disabled="!scene" flat @click.stop="onClickDownload()">
            <v-icon>cloud_download</v-icon>
          </v-btn>
          <v-btn flat>
            <v-icon>cloud_upload</v-icon>
          </v-btn>
          <v-btn flat>
            <v-icon>undo</v-icon>
          </v-btn>
          <v-btn flat>
            <v-icon>redo</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <div id="game" ref="game"></div>
      </v-content>
      <v-footer app></v-footer>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "@/Game";
import TreeDesignerScene from "@/scenes/TreeDesignerScene";
import { IBranchDetails, ILeavesDetails } from "@/gameobjects/IBranchContainer";
import AddBranchCommand from "@/commands/AddBranchCommand";
import AddLeavesCommand from "@/commands/AddLeavesCommand";

@Component
export default class App extends Vue {
  constructor() {
    super();
  }

  private _game!: Game;
  private scene: TreeDesignerScene | null = null;
  private items = [
    { title: "Home", icon: "dashboard" },
    { title: "About", icon: "question_answer" }
  ];
  right = null;

  /**
   * Called after this Vue component has been fully created, the HTML elements are
   * ready and is ready for operation.
   */
  mounted() {
    console.log("Component ready, creating game ...", this);
    // Create the Phaser game and wait for it to be ready.
    this._game = new Game(this.$refs.game as HTMLDivElement);
    this._game.events.on("ready", this.onGameReady);
    window.game = this._game;
  }

  /**
   * This is called once the Phaser game is ready to run, but no scene has been
   * loaded yet.
   */
  onGameReady() {
    console.log("Game ready, waiting for scene ...", this._game);
    // Wait for our only scene to be fully created.
    const scene = this._game.scene.scenes[0] as TreeDesignerScene;
    scene.events.on("scene-created", this.onSceneReady);
  }

  /**
   * Called once the scene has been loaded and everything is ready to go. (This
   * event may be called MULTIPLE times if the window is resized and the scene
   * recreated.)
   * @param scene The scene that is ready.
   */
  onSceneReady(scene: TreeDesignerScene) {
    console.log("Scene ready,  ...", scene);
    this.scene = scene;
    // Hook up scene events
    scene.tree.on("add-branch", this.onAddBranch);
    scene.tree.on("add-leaves", this.onAddLeaves);
  }

  /**
   * Called whenever a branch is left-clicked.
   */
  onAddBranch(details: IBranchDetails) {
    this._game.cmd.execute(new AddBranchCommand(details));
  }

  /**
   * Called whenever a branch is right-clicked.
   */
  onAddLeaves(details: ILeavesDetails) {
    this._game.cmd.execute(new AddLeavesCommand(details));
  }

  /**
   * Called when the user clicks on the download button.
   */
  onClickDownload() {
    this.download();
  }

  download() {
    if (this.scene) {
      const type = "application/json";
      const json = JSON.stringify(this.scene.saveGame());
      const data = "data:" + type + ";charset=utf-8," + encodeURIComponent(json);
      console.log(data)
      const a = document.body.appendChild(document.createElement("a"));
      a.download = "slow-tree.json";
      a.href = data
      a.click();
      console.log(a.outerHTML)
      document.body.removeChild(a);
      return data;
    }
    return "";
  }

  drawer = true;
  mini = true;

  dialog = false;

  leaves = ["Laubblätter", "Nadelblätter"];
  trees = ["Normal Tree", "Not Normal Tree"];
  backgrounds = ["Default", "Forest", "Over Trees"];

  tree = "Normal Tree";
  leaf = "Laubblätter";
  background = "Default";
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
  overflow-y: hidden !important;
}
</style>