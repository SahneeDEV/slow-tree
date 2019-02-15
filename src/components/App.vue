<template>
  <div id="app">
    <v-app dark>
      <v-navigation-drawer app permanent>
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img src="/assets/images/favicon.ico">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>slow-tree</v-list-tile-title>
              </v-list-tile-content>
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
      <v-toolbar app></v-toolbar>
      <v-content>
        <div id="game" ref="game"></div>
      </v-content>
      <v-footer app></v-footer>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "./../Game";

@Component
export default class App extends Vue {
  constructor() {
    super();
  }

  items = [
    { title: "Home", icon: "dashboard" },
    { title: "About", icon: "question_answer" }
  ];
  right = null;

  created() {
    window.setImmediate(this.createDeferred);
  }

  createDeferred() {
    this._game = new Game(this.$refs.game as HTMLDivElement);
    window.game = this._game;
  }

  private _game!: Game;
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