import SlowTreeGame from './Game';
import DemoCommand from './commands/DemoCommand';

const gameDiv = document.getElementById('game')! as HTMLDivElement;
if (!gameDiv) {
    throw new Error('No #game div found!');
}

window.game = new SlowTreeGame(gameDiv);

// Demo command to test.
window.DemoCommand = DemoCommand;
