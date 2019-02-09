import SlowTreeGame from "../SlowTreeGame";

declare global {
    interface Window { game: SlowTreeGame; }
}