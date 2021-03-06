import m from "mithril"
import Game from '../../commons/game/game';
import Player from '../../commons/game/player';
import './style.css';

// game logic
class TickTackToe extends Game {
    constructor() {
        super();
        let players = [
            new Player('X'),
            new Player('O')
        ]
        let currentPlayerIndex = 0;
        this.settings({
            gameName: 'Tick-Tack-Toe',
            players,
            winner: undefined,
            currentPlayerIndex,
            board: [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']],
            history: []
        });
    }
    switchPlayer() {
        this.configuration.currentPlayerIndex = (this.configuration.currentPlayerIndex + 1) % 2;
        console.log('Waiting for player ' + this.configuration.players[this.configuration.currentPlayerIndex]._name + ' to play');
    }
    boardValue(row, col, value = undefined) {
        if (value) {
            this.configuration.board[row][col] = value;
        }
        return this.configuration.board[row][col];
    }
    checkIfGameEnd() {
        let { board } = this.configuration;
        for (let row = 0; row < 3; row++) {
            if (board[row][0] != '-' && board[row][0] === board[row][1] && board[row][0] === board[row][2]) {
                this.winner = { winner: this.configuration.currentPlayerIndex };
                return this.winner;
            }
        }
        for (let col = 0; col < 3; col++) {
            if (board[0][col] != '-' && board[0][col] === board[1][col] && board[0][col] === board[2][col]) {
                this.winner = { winner: this.configuration.currentPlayerIndex };
                return this.winner;
            }
        }
        if (board[0][0] != '-' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            this.winner = { winner: this.configuration.currentPlayerIndex };
            return this.winner;
        }
        if (board[0][2] != '-' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            this.winner = { winner: this.configuration.currentPlayerIndex };
            return this.winner;
        }
        let isDraw = true;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                isDraw = isDraw && (this.boardValue(row, col) != '-');
                if (row * col === 4 && isDraw) {
                    this.winner = { winner: -1 };
                    return this.winner;
                }
            }
        }
    }
    playTurn(row, col) {
        super.playTurn();
        if (this.winner) {
            console.log("The game has already ended");
            return;
        }
        console.log('current player is ', this.configuration.players[this.configuration.currentPlayerIndex]._name);
        let currentValue = this.boardValue(row, col);
        if (!currentValue || currentValue === '-') {
            this.boardValue(row, col, this.configuration.players[this.configuration.currentPlayerIndex]._name);
            let winner = this.checkIfGameEnd();
            if (winner) {
                if (winner.winner === -1) {
                    console.log("This is a draw");
                } else {
                    console.log("Winner is ", this.configuration.players[winner.winner]);
                }
            } else {
                this.switchPlayer();
            }
        } else {
            console.log("handle invalid play");
        }
    }
}

let game;

// game view
let TickTackToeView = {
    oninit: (vnode) => {
        game = new TickTackToe();
        console.log('game view initialised');
    },
    oncreate: (vnode) => {
        console.log('game view created');
    },
    onbeforeupdate: function (newVnode, oldVnode) {
        return true
    },
    onupdate: function (vnode) {
        console.log("game view updated")
    },
    onbeforeremove: function (vnode) {
        console.log("exit animation can start")
        return new Promise(function (resolve) {
            // call after animation completes
            resolve()
        })
    },
    onremove: function (vnode) {
        console.log("removing game view element")
    },
    startGame: () => {
        TickTackToeView.oninit();
        game.start();
        m.redraw();
    },
    pauseGame: () => {
        let prevStatus = game.getStatus();
        game.pause();
        return prevStatus;
    },
    continueGame: () => {
        game.continue();
        m.redraw();
    },
    saveGame: () => {
        let prevStatus = TickTackToeView.pauseGame();
        console.log('save game here', prevStatus);
        // do the saveGame task here
        let taskDone = true;
        if (taskDone) {
            if (prevStatus === 'initialised' || prevStatus === 'quit') {
                game.init();
                m.redraw();
            } else {
                TickTackToeView.continueGame();
            }
        }
    },
    loadGame: () => {
        let prevStatus = TickTackToeView.pauseGame();
        console.log('load game here', prevStatus);
        // do the loadGame task here
        let taskDone = true;
        if (taskDone) {
            if (prevStatus === 'initialised' || prevStatus === 'quit') {
                game.init();
                m.redraw();
            } else {
                TickTackToeView.continueGame();
            }
        }
    },
    quitGame: () => {
        let prevStatus = TickTackToeView.pauseGame();
        let confirmation = TickTackToeView.confirmQuit();
        if (confirmation) {
            game.quit();
            m.redraw();
        } else {
            if (prevStatus === 'initialised' || prevStatus === 'quit') {
                game.init();
                m.redraw();
            } else {
                TickTackToeView.continueGame();
            }
        }
    },
    settings: () => {
        let prevStatus = TickTackToeView.pauseGame();
        console.log('settings here', prevStatus);
        // do the settings task here
        let taskDone = true;
        if (taskDone) {
            if (prevStatus === 'initialised' || prevStatus === 'quit') {
                game.init();
                m.redraw();
            } else {
                TickTackToeView.continueGame();
            }
        }
    },
    confirmQuit: () => {
        return confirm("wanna chicken out?");
    },
    Header: {
        oncreate: () => {
            // $('.btn-continue').unbind().click(TickTackToe.game.continue);
            // $('.btn-pause').unbind().click(TickTackToe.game.pause);
            // $('.btn-quit').unbind().click(TickTackToe.game.quit);
        },
        view: () => {
            if (game.getStatus() === 'paused') {
                return m('.game-header', [
                    m('button.btn.btn-continue', { onclick: TickTackToeView.continueGame }, 'Continue'),
                    m('button.btn.btn-quit', { onclick: TickTackToeView.quitGame }, 'Quit'),
                ])
            } else if (game.getStatus() === 'started' || game.getStatus() === 'continued') {
                return m('.game-header', [
                    m('button.btn.btn-pause', { onclick: TickTackToeView.pauseGame }, 'Pause'),
                    m('button.btn.btn-quit', { onclick: TickTackToeView.quitGame }, 'Quit'),
                ])
            } else {
                return m('.game-header', [
                    m('button.btn.btn-quit', { onclick: TickTackToeView.quitGame }, 'Quit'),
                ])
            }
        },
    },
    MainMenu: {
        view: () => {
            return m('.game-mainmenu', [
                m('ul.game-mainmenu-list', [
                    m('li.game-mainmenu-list-item',
                        game.getStatus() === "paused" ? m('button.btn', { onclick: TickTackToeView.continueGame }, "Continue") : m('button.btn', { onclick: TickTackToeView.startGame }, "Start"),
                    ),
                    m('li.game-mainmenu-list-item',
                        m('button.btn', { onclick: TickTackToeView.saveGame, disabled: true }, "Save"),
                    ),
                    m('li.game-mainmenu-list-item',
                        m('button.btn', { onclick: TickTackToeView.loadGame, disabled: true }, "Load"),
                    ),
                    m('li.game-mainmenu-list-item',
                        m('button.btn', { onclick: TickTackToeView.settings, disabled: true }, "Settings"),
                    ),
                    m('li.game-mainmenu-list-item',
                        m('button.btn', { onclick: TickTackToeView.quitGame }, "Quit"),
                    ),
                ])
            ])
        }
    },
    Board: {
        view: () => {
            return m('.game-board', [
                m('.game-board-row', [
                    m('.game-board-col',
                        m('button.t3btn#b00', { onclick: () => game.playTurn(0, 0) }, game.boardValue(0, 0)),
                    ),
                    m('.game-board-col',
                        m('button.t3btn#b01', { onclick: () => game.playTurn(0, 1) }, game.boardValue(0, 1)),
                    ),
                    m('.game-board-col',
                        m('button.t3btn#b02', { onclick: () => game.playTurn(0, 2) }, game.boardValue(0, 2)),
                    ),
                ]),
                m('div', [
                    m('.game-board-col',
                        m('button.t3btn#b10', { onclick: () => game.playTurn(1, 0) }, game.boardValue(1, 0)),
                    ),
                    m('.game-board-col',
                        m('button.t3btn#b11', { onclick: () => game.playTurn(1, 1) }, game.boardValue(1, 1)),
                    ),
                    m('.game-board-col',
                        m('button.t3btn#b12', { onclick: () => game.playTurn(1, 2) }, game.boardValue(1, 2)),
                    ),
                ]),
                m('div', [
                    m('.game-board-col',
                        m('button.t3btn#b20', { onclick: () => game.playTurn(2, 0) }, game.boardValue(2, 0)),
                    ),
                    m('.game-board-col',
                        m('button.t3btn#b21', { onclick: () => game.playTurn(2, 1) }, game.boardValue(2, 1)),
                    ),
                    m('.game-board-col',
                        m('button.t3btn#b22', { onclick: () => game.playTurn(2, 2) }, game.boardValue(2, 2)),
                    ),
                ])
            ])
        }
    },
    WinnerBanner: {
        view: (vnode) => {
            console.log(vnode, vnode.attrs);
            let winner = vnode.attrs.winner;
            if (winner && winner.winner == -1) {
                return m('.game-banner', [
                    m('.game-message', "This is a draw!"),
                    m('button.btn.btn-restart', { onclick: TickTackToeView.startGame }, 'Start Again'),
                ])
            } else if (winner && winner.winner > -1) {
                winner = game.configuration.players[winner.winner];
                winner = winner._name;
                return m('.game-banner', [
                    m('.game-message', winner + " has won!"),
                    m('button.btn.btn-restart', { onclick: TickTackToeView.startGame }, 'Start Again'),
                ])
            } else {
                let currentPlayer = game.configuration.players[game.configuration.currentPlayerIndex];
                return m('.game-banner', [
                    m('.game-message', "Now playing " + currentPlayer._name),
                ])
            }
        }
    },
    Footer: {
        oncreate: () => {
            // $('.btn-continue').unbind().click(TickTackToe.game.continue);
            // $('.btn-pause').unbind().click(TickTackToe.game.pause);
            // $('.btn-quit').unbind().click(TickTackToe.game.quit);
        },
        view: () => {
            if (game.getStatus() === 'paused') {
                return m('.game-footer', [
                    m('button.btn.btn-continue', { onclick: TickTackToeView.continueGame }, 'Continue'),
                    m('button.btn.btn-quit', { onclick: TickTackToeView.quitGame }, 'Quit'),
                ])
            } else if (game.getStatus() === 'started' || game.getStatus() === 'continued') {
                return m('.game-footer', [
                    m('button.btn.btn-pause', { onclick: TickTackToeView.pauseGame }, 'Pause'),
                    m('button.btn.btn-quit', { onclick: TickTackToeView.quitGame }, 'Quit'),
                ])
            } else {
                return m('.game-footer', [
                    m('button.btn.btn-quit', { onclick: TickTackToeView.quitGame }, 'Quit'),
                ])
            }
        },
    },
    view: (vnode) => {
        let Header = TickTackToe.Header;
        let MainMenu = TickTackToe.MainMenu;
        let Board = TickTackToe.Board;
        let Footer = TickTackToe.Footer;
        let winner = game.checkIfGameEnd();
        if (game.getStatus() === 'paused' || game.getStatus() === 'initialised' || game.getStatus() === 'quit') {
            return m('.game-controller', [
                m(TickTackToeView.Header),
                m(TickTackToeView.MainMenu),
            ])
        } else {
            if (winner) console.log('winner', winner);
            return m('.game-controller', [
                m(TickTackToeView.Header),
                m(TickTackToeView.WinnerBanner, { winner }),
                m(TickTackToeView.Board),
                m(TickTackToeView.Footer),
            ])
        }
    },
}

export default TickTackToeView;