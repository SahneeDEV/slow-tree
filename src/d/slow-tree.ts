import SlowTreeGame from "./../Game";
import DemoCommand from "./../commands/DemoCommand";
import Vue from "vue";

declare global {
    interface Window { 
        game: SlowTreeGame; 
        vue: Vue;
        DemoCommand: typeof DemoCommand 
    }
}