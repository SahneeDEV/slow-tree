//import SlowTreeGame from './Game';
//import DemoCommand from './commands/DemoCommand';
import Vue from 'vue'
import Test from "./components/Test.vue";

const gameDiv = document.getElementById('game')! as HTMLDivElement;
if (!gameDiv) {
    throw new Error('No #game div found!');
}

new Vue({
    render: h => h(Test)
  }).$mount(gameDiv)

//window.game = new SlowTreeGame(gameDiv);

var layout   = document.getElementById('layout'),
    menu     = document.getElementById('menu'),
    menuLink = document.getElementById('menuLink'),
    content  = document.getElementById('game');

function toggleClass(element: HTMLElement | null, className: string) {
    if (element === null) {
        throw new Error("Variable element can not be empty!");
    }
    else {
       var classes = element.className.split(/\s+/) || null,
         length = classes.length,
         i = 0;

    }

    for(; i < length; i++) {
        if (classes[i] === className) {
        classes.splice(i, 1);
        break;
        }
    }
    // The className is not found
    if (length === classes.length) {
        classes.push(className);
    }

    element.className = classes.join(' ');
}

function toggleAll(e: MouseEvent) {
    var active = 'active';

    e.preventDefault();
    toggleClass(layout, active);
    toggleClass(menu, active);
    toggleClass(menuLink, active);
}

if (menuLink === null) {
    throw new Error("Variable menuLink can not be null!");
}
else {
    menuLink.onclick = function (e) {
        toggleAll(e);
    };
}

if (content === null) {
    throw new Error("Variable content can not be null!");
}
else {
    content.onclick = function(e) {

        if (menu === null) {
            throw new Error("Variable menu can not be empty!")
        }
        else {
            if (menu.className.indexOf('active') !== -1) {
                toggleAll(e);
            }
        }
    };
}
