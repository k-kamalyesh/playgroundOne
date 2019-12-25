import m from "mithril"
import Game from '../../commons/game/game';
import Player from '../../commons/game/player';

let TickTackToe = {
    config:{},
    players: [],
    game: {},
    board:[],
    currentPlayer: 0,
    oninit: (vnode) => {
        TickTackToe.players = [
            new Player('X'),
            new Player('O')
        ]
        TickTackToe.currentPlayer = 0;
        TickTackToe.config = {
            gameName:'Tick-Tack-Toe',
            players:TickTackToe.players,
            currentPlayer:TickTackToe.currentPlayer,
            history:[]
        }
        TickTackToe.game = new Game(TickTackToe.config);
        console.log('game initialised', TickTackToe.game);
    },
    switchPlayer: () => {
        TickTackToe.currentPlayer = (TickTackToe.currentPlayer + 1) % 2;
    },
    oncreate: (vnode) => {
        m.mount(document.getElementById('header'), TickTackToe.Header);
        m.mount(document.getElementById('menu'), TickTackToe.Menu);
        m.mount(document.getElementById('board'), TickTackToe.Board);
    },
    onbeforeupdate: function (newVnode, oldVnode) {
        return true
    },
    onupdate: function (vnode) {
        console.log("DOM updated")
    },
    onbeforeremove: function (vnode) {
        console.log("exit animation can start")
        return new Promise(function (resolve) {
            // call after animation completes
            resolve()
        })
    },
    onremove: function (vnode) {
        console.log("removing DOM element")
    },
    Header: {    
        oncreate:()=>{
            // $('.btn-continue').unbind().click(TickTackToe.game.continue);
            // $('.btn-pause').unbind().click(TickTackToe.game.pause);
            // $('.btn-quit').unbind().click(TickTackToe.game.quit);
        },
        view: () => {
            if (TickTackToe.game.getStatus() === 'paused') {
                return m('.game-header', [
                    m('button.btn-continue', 'Continue'),
                    m('button.btn-quit', 'Quit'),
                ])
            } else if (TickTackToe.game.getStatus() === 'started' || TickTackToe.game.getStatus() === 'continued') {
                return m('.game-header', [
                    m('button.btn-pause', 'Pause'),
                    m('button.btn-quit', 'Quit'),
                ])
            } else {
                return m('.game-header', [
                    m('button.btn-quit', {'onclick':()=>{
                        console.log('clicked quit');
                        TickTackToe.game.quit();
                    }},'Quit'),
                ])
            }
        },
    },
    Menu :{

        view: () => {
    
            return m('.game-menu', [
                m('ul.game-menu-list', [
                    m('li.game-menu-list-item', "Start"),
                    m('li.game-menu-list-item', "Save"),
                    m('li.game-menu-list-item', "Load"),
                    m('li.game-menu-list-item', "Settings"),
                    m('li.game-menu-list-item', "Quit"),
                ])
            ])
        }
    },
    Board:{
        view:()=>{
            return m('div', [
                m('div', [
                    m('button.t3btn#b00'),
                    m('button.t3btn#b01'),
                    m('button.t3btn#b02'),
                ]),
                m('div', [
                    m('button.t3btn#b10'),
                    m('button.t3btn#b11'),
                    m('button.t3btn#b12'),
                ]),
                m('div', [
                    m('button.t3btn#b20'),
                    m('button.t3btn#b21'),
                    m('button.t3btn#b22'),
                ])
            ])
        }
    },
    view: (vnode) => {
        let Header = TickTackToe.Header;
        let Menu = TickTackToe.Menu;
        return TickTackToe.game.getStatus() === 'paused' || TickTackToe.game.getStatus() === 'initialised' ?
            m('.game-controller',[
                m('#header', 'game header'),
                m('#menu', 'game menu')
            ]): 
            m('.game-controller', [
                m('#header', 'game header'),
                m('#board', 'game board'),
                m('#footer', 'game footer'),
            ])
    },
}

export default TickTackToe;