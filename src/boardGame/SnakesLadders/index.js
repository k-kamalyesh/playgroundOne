import m from "mithril"
import Game from '../../commons/game/game';
import Player from '../../commons/game/player';
import Dice from '../../commons/game/dice';
import './style.css';

// game logic
class SnakesLadders extends Game {
    constructor() {
        super();
        let players = [
            new Player('p1', 'red', 0),
            new Player('p2', 'green', 0),
            new Player('p3', 'yellow', 0),
            new Player('p4', 'blue', 0),
        ]
        let currentPlayerIndex = 0;
        let board = [];
        for (let index = 0; index < 10; index++) {
            board.push([]);
            for (let index2 = 0; index2 < 10; index2++) {
                if (index % 2) {
                    board[index].push(index * 10 + 10 - index2)
                } else {
                    board[index].push(index * 10 + index2 + 1)
                }
            }
        }
        this.settings({
            gameName: 'SnakesLadders',
            currentDiceFace: 0,
            dice: new Dice(6),
            players,
            winner: undefined,
            currentPlayerIndex,
            board,
            history: []
        });

    }
    switchPlayer() {
        this.configuration.currentPlayerIndex = (this.configuration.currentPlayerIndex + 1) % this.configuration.players.length;
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
        for (let i = 0; i < this.configuration.players.length; i++) {
            const player = this.configuration.players[i];
            if (player.position() == 100) {
                return { winner: i };
            }
        }
    }
    playTurn() {
        super.playTurn();
        if (this.winner) {
            console.log("The game has already ended");
            return;
        }

        let currentPlayer = this.configuration.players[this.configuration.currentPlayerIndex]
        // get board row and col at current player position
        let currentPlayerPosition = currentPlayer.position();
        this.configuration.currentDiceFace = this.configuration.dice.rollTheDice();
        currentPlayerPosition += this.configuration.currentDiceFace;
        console.log('current player is ', this.configuration.players[this.configuration.currentPlayerIndex]._name);
        if (currentPlayerPosition <= 100) {
            let row = currentPlayerPosition / 10;
            let col;
            if (row % 2) {
                col = 10 - currentPlayerPosition % 10;
            } else {
                col = currentPlayerPosition % 10;
            }
            this.configuration.players[this.configuration.currentPlayerIndex].position(currentPlayerPosition);
            console.log("new position: ", currentPlayerPosition);
            let winner = this.checkIfGameEnd();
            console.log("winner calculated: ", winner);

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
            this.switchPlayer();
            // console.log("handle invalid play");
        }
    }
}

let game;

// game view
let SnakesLaddersView = {
    oninit: (vnode) => {
        game = new SnakesLadders();
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
        SnakesLaddersView.oninit();
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
        let prevStatus = SnakesLaddersView.pauseGame();
        console.log('save game here', prevStatus);
        // do the saveGame task here
        let taskDone = true;
        if (taskDone) {
            if (prevStatus === 'initialised' || prevStatus === 'quit') {
                game.init();
                m.redraw();
            } else {
                SnakesLaddersView.continueGame();
            }
        }
    },
    loadGame: () => {
        let prevStatus = SnakesLaddersView.pauseGame();
        console.log('load game here', prevStatus);
        // do the loadGame task here
        let taskDone = true;
        if (taskDone) {
            if (prevStatus === 'initialised' || prevStatus === 'quit') {
                game.init();
                m.redraw();
            } else {
                SnakesLaddersView.continueGame();
            }
        }
    },
    quitGame: () => {
        let prevStatus = SnakesLaddersView.pauseGame();
        let confirmation = SnakesLaddersView.confirmQuit();
        if (confirmation) {
            game.quit();
            m.redraw();
        } else {
            if (prevStatus === 'initialised' || prevStatus === 'quit') {
                game.init();
                m.redraw();
            } else {
                SnakesLaddersView.continueGame();
            }
        }
    },
    settings: () => {
        let prevStatus = SnakesLaddersView.pauseGame();
        console.log('settings here', prevStatus);
        // do the settings task here
        let taskDone = true;
        if (taskDone) {
            if (prevStatus === 'initialised' || prevStatus === 'quit') {
                game.init();
                m.redraw();
            } else {
                SnakesLaddersView.continueGame();
            }
        }
    },
    confirmQuit: () => {
        return confirm("wanna chicken out?");
    },
    Header: {
        oncreate: () => {
            // $('.btn-continue').unbind().click(SnakesLadders.game.continue);
            // $('.btn-pause').unbind().click(SnakesLadders.game.pause);
            // $('.btn-quit').unbind().click(SnakesLadders.game.quit);
        },
        view: () => {
            if (game.getStatus() === 'paused') {
                return m('.game-header', [
                    m('button.btn.btn-continue', { onclick: SnakesLaddersView.continueGame }, 'Continue'),
                    m('button.btn.btn-quit', { onclick: SnakesLaddersView.quitGame }, 'Quit'),
                ])
            } else if (game.getStatus() === 'started' || game.getStatus() === 'continued') {
                return m('.game-header', [
                    m('button.btn.btn-pause', { onclick: SnakesLaddersView.pauseGame }, 'Pause'),
                    m('button.btn.btn-quit', { onclick: SnakesLaddersView.quitGame }, 'Quit'),
                ])
            } else {
                return m('.game-header', [
                    m('button.btn.btn-quit', { onclick: SnakesLaddersView.quitGame }, 'Quit'),
                ])
            }
        },
    },
    MainMenu: {
        view: () => {
            return m('.game-mainmenu', [
                m('ul.game-mainmenu-list', [
                    m('li.game-mainmenu-list-item',
                        game.getStatus() === "paused" ? m('button.btn', { onclick: SnakesLaddersView.continueGame }, "Continue") : m('button.btn', { onclick: SnakesLaddersView.startGame }, "Start"),
                    ),
                    m('li.game-mainmenu-list-item',
                        m('button.btn', { onclick: SnakesLaddersView.saveGame, disabled: true }, "Save"),
                    ),
                    m('li.game-mainmenu-list-item',
                        m('button.btn', { onclick: SnakesLaddersView.loadGame, disabled: true }, "Load"),
                    ),
                    m('li.game-mainmenu-list-item',
                        m('button.btn', { onclick: SnakesLaddersView.settings, disabled: true }, "Settings"),
                    ),
                    m('li.game-mainmenu-list-item',
                        m('button.btn', { onclick: SnakesLaddersView.quitGame }, "Quit"),
                    ),
                ])
            ])
        }
    },
    Board: {
        view: () => {
            let displayBoard = []
            for (let index = 0; index < 10; index++) {
                let displayRow = [];
                for (let index2 = 9; index2 >= 0; index2--) {
                    let pos = game.boardValue(index2, index);
                    let found = game.configuration.players.findIndex(player => player.position() === pos);
                    if (found != -1) {
                        displayRow.push(
                            m('.game-board-col',
                                m(`div.s-l-cell`,
                                    m(`div.s-l-${game.configuration.players[found].color()}#s-l-cell-${index2}${index}`, game.boardValue(index2, index))
                                ),
                            )
                        )
                    } else {
                        displayRow.push(
                            m('.game-board-col',
                                m(`div.s-l-cell#s-l-cell-${index2}${index}`, game.boardValue(index2, index)),
                            )
                        )
                    }
                }
                displayBoard.push(m('.game-board-row', displayRow));
            }
            return m('.game-board', displayBoard)
        }
    },
    WinnerBanner: {
        view: (vnode) => {
            console.log(vnode, vnode.attrs);
            let winner = vnode.attrs.winner;
            if (winner && winner.winner == -1) {
                return m('.game-banner', [
                    m('.game-message', "This is a draw!"),
                    m('button.btn.btn-restart', { onclick: SnakesLaddersView.startGame }, 'Start Again'),
                ])
            } else if (winner && winner.winner > -1) {
                winner = game.configuration.players[winner.winner];
                winner = winner._name;
                return m('.game-banner', [
                    m('.game-message', winner + " has won!"),
                    m('button.btn.btn-restart', { onclick: SnakesLaddersView.startGame }, 'Start Again'),
                ])
            } else {
                let currentPlayer = game.configuration.players[game.configuration.currentPlayerIndex];
                let name = currentPlayer._name
                return m('.game-banner', [
                    m('.game-message', "Now playing " + name),
                    m('button.btn-play-turn', { onclick: () => game.playTurn() }, "Play")
                ])
            }
        }
    },
    Footer: {
        oncreate: () => {
            // $('.btn-continue').unbind().click(SnakesLadders.game.continue);
            // $('.btn-pause').unbind().click(SnakesLadders.game.pause);
            // $('.btn-quit').unbind().click(SnakesLadders.game.quit);
        },
        view: () => {
            if (game.getStatus() === 'paused') {
                return m('.game-footer', [
                    m('button.btn.btn-continue', { onclick: SnakesLaddersView.continueGame }, 'Continue'),
                    m('button.btn.btn-quit', { onclick: SnakesLaddersView.quitGame }, 'Quit'),
                ])
            } else if (game.getStatus() === 'started' || game.getStatus() === 'continued') {
                return m('.game-footer', [
                    m('button.btn.btn-pause', { onclick: SnakesLaddersView.pauseGame }, 'Pause'),
                    m('button.btn.btn-quit', { onclick: SnakesLaddersView.quitGame }, 'Quit'),
                ])
            } else {
                return m('.game-footer', [
                    m('button.btn.btn-quit', { onclick: SnakesLaddersView.quitGame }, 'Quit'),
                ])
            }
        },
    },
    view: (vnode) => {
        let Header = SnakesLadders.Header;
        let MainMenu = SnakesLadders.MainMenu;
        let Board = SnakesLadders.Board;
        let Footer = SnakesLadders.Footer;
        let winner = game.checkIfGameEnd();
        if (game.getStatus() === 'paused' || game.getStatus() === 'initialised' || game.getStatus() === 'quit') {
            return m('.game-controller', [
                m(SnakesLaddersView.Header),
                m(SnakesLaddersView.MainMenu),
            ])
        } else {
            if (winner) console.log('winner', winner);
            return m('.game-controller', [
                m(SnakesLaddersView.Header),
                m(SnakesLaddersView.WinnerBanner, { winner }),
                m(SnakesLaddersView.Board),
                m(SnakesLaddersView.Footer),
            ])
        }
    },
}

export default SnakesLaddersView;