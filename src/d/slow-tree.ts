import SlowTreeGame from "./../Game";
import DemoCommand from "./../commands/DemoCommand";
import Vue from "vue";

declare global {
    interface Window {
        game: SlowTreeGame;
        vue: Vue;
        DemoCommand: typeof DemoCommand;
    }


    const process: {
        readonly env: {
            readonly NODE_ENV: "production" | "development"
            readonly SERVICE_WORKER: "true" | "false";
            readonly BROWSERSYNC: "true" | "false";
            readonly ROOT: string;
        }
    }


}