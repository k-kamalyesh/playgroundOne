import m from "mithril";
import TickTackToe from './boardGame/tickTackToe/index';

// let tickTackToe = m('div', TickTackToe)
m.mount(document.getElementById('game-content'), TickTackToe);