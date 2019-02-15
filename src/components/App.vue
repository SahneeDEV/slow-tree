<template>
  <div id="app">
    <div id="layout">
      <!-- Menu toggle -->
      <a href="#menu" class="menu-link" id="menuLink">
        <!-- Hamburger icon -->
        <span></span>
      </a>

      <div id="menu">
        <div class="pure-menu">
          <a class="pure-menu-heading">slow-tree</a>

          <ul class="pure-menu-list">
            <li class="pure-menu-item pure-menu-selected">
              <a href="#" class="pure-menu-link">Game</a>
            </li>
            <li class="pure-menu-item">
              <a href="#" class="pure-menu-link">About</a>
            </li>
          </ul>
          <div class="content content-form">
            <form class="pure-form pure-form-stacked">
              <fieldset>
                <div class="pure-u-1">
                  <label for="first-name">First Name</label>
                  <input id="first-name" type="text">
                </div>

                <div class="pure-u-1">
                  <label for="first-name">First Name</label>
                  <input id="first-name" type="text">
                </div>
                <div class="pure-u-1">
                  <label for="first-name">First Name</label>
                  <input id="first-name" type="text">
                </div>
                <div class="pure-u-1">
                  <label for="first-name">First Name</label>
                  <input id="first-name" type="text">
                </div>

                <div class="pure-u-1">
                  <label for="state">State</label>
                  <select id="state" class="pure-input-1-2">
                    <option>AL</option>
                    <option>CA</option>
                    <option>IL</option>
                  </select>
                </div>

                <div class="pure-u-1">
                  <label for="terms" class="pure-checkbox">
                    <input id="terms" type="checkbox"> I've read the terms and conditions
                  </label>
                </div>

                <button type="submit" class="pure-button pure-button-primary">Submit</button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
      <div id="game" ref="game"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from './../Game';

@Component
export default class App extends Vue {
  constructor() {
    super();
  }

  created() {
    window.setImmediate(this.createDeferred);
  }

  createDeferred() {
    this._game = new Game(this.$refs.game as HTMLDivElement)
  }

  private _game!: Game;
}
</script>

