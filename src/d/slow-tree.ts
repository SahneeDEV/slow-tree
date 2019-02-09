import SlowTreeGame from "../Game";
import DemoCommand from "../commands/DemoCommand";

declare global {
    interface Window { 
        game: SlowTreeGame; 
        DemoCommand: typeof DemoCommand 
    }
}