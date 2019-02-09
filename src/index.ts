import SlowTreeGame from './SlowTreeGame';

const gameDiv = document.getElementById('game')! as HTMLDivElement;
if (!gameDiv) {
    throw new Error('No #game div found!');
}

window.game = new SlowTreeGame(gameDiv);
