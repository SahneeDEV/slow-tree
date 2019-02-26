<template>
  <div class="hover">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex offset-xs8 xs4 class="info-text">
          <v-card>
            <h3>Details</h3>
            <p>Insert data here</p>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SlowTreeGame from "@/Game";
import TreeDesignerScene from "@/scenes/TreeDesignerScene";
import TreeGameObject from "@/gameobjects/TreeGameObject";
import BranchGameObject from "@/gameobjects/BranchGameObject";
import LeavesGameObject from "@/gameobjects/LeavesGameObject";

@Component
export default class STHoverInformation extends Vue {
  @Prop() public game!: SlowTreeGame;
  @Prop() public scene!: TreeDesignerScene;

  constructor() {
    super();
  }

  mounted() {
    this.scene.tree.on(Phaser.Input.Events.POINTER_OVER, this.onHoverTree);
  }

  onHoverTree(e: {
    over: TreeGameObject | BranchGameObject | LeavesGameObject;
  }) {
    console.log(e.over);
  }
}
</script>

<style scoped>
.info-text {
  text-align: right;
}
.hover {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
</style>

