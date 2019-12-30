import m from "mithril"
import Game from '../../commons/game/game';
import Player from '../../commons/game/player';

// game logic
class TickTackToe extends Game {
    constructor(){
        super();
        let players = [
            new Player('X'),
            new Player('O')
        ]
        let currentPlayerIndex = 0;
        this.settings({
            gameName:'Tick-Tack-Toe',
            players,
            currentPlayerIndex,
            board:[['-', '-', '-'],['-', '-', '-'],['-', '-', '-']],
            history:[]
        });
    }
    switchPlayer() {
        this.configuration.currentPlayerIndex = (this.configuration.currentPlayerIndex + 1) % 2;
        console.log('Waiting for player '+this.configuration.players[this.configuration.currentPlayerIndex].name+' to play');
    }
    boardValue(row, col, value=undefined){
        if(value){
            this.configuration.board[row][col]=value;
        }
        return this.configuration.board[row][col];
    }
    checkIfGameEnd(){
        let {board} = this.configuration;
        for (let row = 0; row < 3; row++) {
            if(board[row][0] != '-' && board[row][0] === board[row][1] && board[row][0] === board[row][2]){
                return {winner:this.configuration.currentPlayerIndex};
            }
        }
        for (let col = 0; col < 3; col++) {
            if(board[0][col] != '-' &&  board[0][col] === board[1][col] && board[0][col] === board[2][col]){
                return {winner:this.configuration.currentPlayerIndex};
            }
        }
        if(board[0][0] !='-' && board[0][0] === board[1][1] && board[0][0] === board[2][2]){
            return {winner:this.configuration.currentPlayerIndex};
        }
        if(board[0][2] !='-' && board[0][2] === board[1][1] && board[0][2] === board[2][0]){
            return {winner:this.configuration.currentPlayerIndex};
        }
        let isDraw = true;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                isDraw = isDraw && (this.boardValue(row, col) != '-');
                if(row*col === 4 && isDraw){
                    return {winner:-1};
                }
            }
        }
    }
    playTurn(row, col){
        super.playTurn();
        console.log('current player is ', this.configuration.players[this.configuration.currentPlayerIndex].name);
        let currentValue=this.boardValue(row, col);
        if(!currentValue || currentValue==='-'){
            this.boardValue(row, col, this.configuration.players[this.configuration.currentPlayerIndex].name);
            let winner= this.checkIfGameEnd();
            if(winner){
                if(winner.winner === -1){
                    console.log("This is a draw");
                }else{
                    console.log("Winner is ",this.configuration.players[winner.winner]);
                }
            }else{
                this.switchPlayer();
            }
        }else{
            console.log("handle invalid play");
        }
    }
}

let game;

// game view
let TickTackToeView = {
    oninit: (vnode) => {
        game=new TickTackToe();
        console.log('game view initialised' );
    },
    oncreate: (vnode) => {
        console.log('game view created' );
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
    startGame:()=>{
        TickTackToeView.oninit();
        game.start();
        m.redraw();  
    },
    pauseGame:()=>{
        let prevStatus = game.getStatus();
        game.pause();
        return prevStatus;
    },
    continueGame:()=>{
        game.continue();
        m.redraw(); 
    },
    saveGame:()=>{
        let prevStatus = TickTackToeView.pauseGame();
        console.log('save game here', prevStatus);
        // do the saveGame task here
        let taskDone = true;
        if(taskDone){
            if(prevStatus==='initialised' || prevStatus ==='quit'){
                game.init();
                m.redraw();
            }else{
                TickTackToeView.continueGame();
            }
        }
    },
    loadGame:()=>{
        let prevStatus = TickTackToeView.pauseGame();
        console.log('load game here', prevStatus);
        // do the loadGame task here
        let taskDone = true;
        if(taskDone){
            if(prevStatus==='initialised' || prevStatus ==='quit'){
                game.init();
                m.redraw();
            }else{
                TickTackToeView.continueGame();
            }
        } 
    },
    quitGame:()=>{
        let prevStatus = TickTackToeView.pauseGame();
        let confirmation = TickTackToeView.confirmQuit();
        if(confirmation){
            game.quit();
            m.redraw();
        }else{
            if(prevStatus==='initialised' || prevStatus ==='quit'){
                game.init();
                m.redraw();
            }else{
                TickTackToeView.continueGame();
            }
        } 
    },
    settings:()=>{
        let prevStatus = TickTackToeView.pauseGame();
        console.log('settings here', prevStatus);
        // do the settings task here
        let taskDone = true;
        if(taskDone){
            if(prevStatus==='initialised' || prevStatus ==='quit'){
                game.init();
                m.redraw();
            }else{
                TickTackToeView.continueGame();
            }
        }
    },
    confirmQuit:()=>{
        return confirm("wanna chicken out?");
    },
    Header: {    
        oncreate:()=>{
            // $('.btn-continue').unbind().click(TickTackToe.game.continue);
            // $('.btn-pause').unbind().click(TickTackToe.game.pause);
            // $('.btn-quit').unbind().click(TickTackToe.game.quit);
        },
        view: () => {
            if (game.getStatus() === 'paused') {
                return m('.game-header', [
                    m('button.btn-continue', {onclick:TickTackToeView.continueGame},'Continue'),
                    m('button.btn-quit', {onclick:TickTackToeView.quitGame},'Quit'),
                ])
            } else if (game.getStatus() === 'started' || game.getStatus() === 'continued') {
                return m('.game-header', [
                    m('button.btn-pause', {onclick:TickTackToeView.pauseGame},'Pause'),
                    m('button.btn-quit', {onclick:TickTackToeView.quitGame},'Quit'),
                ])
            } else {
                return m('.game-header', [
                    m('button.btn-quit', {onclick:TickTackToeView.quitGame},'Quit'),
                ])
            }
        },
    },
    MainMenu :{
        view: () => {
            return m('.game-mainmenu', [
                m('ul.game-mainmenu-list', [
                    m('li.game-mainmenu-list-item', {onclick:TickTackToeView.startGame}, "Start"),
                    m('li.game-mainmenu-list-item', {onclick:TickTackToeView.saveGame}, "Save"),
                    m('li.game-mainmenu-list-item', {onclick:TickTackToeView.loadGame}, "Load"),
                    m('li.game-mainmenu-list-item', {onclick:TickTackToeView.settings}, "Settings"),
                    m('li.game-mainmenu-list-item', {onclick:TickTackToeView.quitGame}, "Quit"),
                ])
            ])
        }
    },
    Board:{
        view:()=>{
            return m('div', [
                m('div', [
                    m('button.t3btn#b00', {onclick:()=>game.playTurn(0, 0)}, game.boardValue(0, 0)),
                    m('button.t3btn#b01', {onclick:()=>game.playTurn(0, 1)}, game.boardValue(0, 1)),
                    m('button.t3btn#b02', {onclick:()=>game.playTurn(0, 2)}, game.boardValue(0, 2)),
                ]),
                m('div', [
                    m('button.t3btn#b10', {onclick:()=>game.playTurn(1, 0)}, game.boardValue(1, 0)),
                    m('button.t3btn#b11', {onclick:()=>game.playTurn(1, 1)}, game.boardValue(1, 1)),
                    m('button.t3btn#b12', {onclick:()=>game.playTurn(1, 2)}, game.boardValue(1, 2)),
                ]),
                m('div', [
                    m('button.t3btn#b20', {onclick:()=>game.playTurn(2, 0)}, game.boardValue(2, 0)),
                    m('button.t3btn#b21', {onclick:()=>game.playTurn(2, 1)}, game.boardValue(2, 1)),
                    m('button.t3btn#b22', {onclick:()=>game.playTurn(2, 2)}, game.boardValue(2, 2)),
                ])
            ])
        }
    },
    WinnerBanner:{
        view:(vnode)=>{
            console.log(vnode, vnode.attrs);
            let winner = vnode.attrs.winner.winner;
            if(winner==-1){
                return m('.game-winner-banner-container', [
                    m('.game-winner-banner',"This is a draw!"),
                    m('button.btn-restart', {onclick:TickTackToeView.startGame}, 'Start Again'),
                ])
            }else{
                winner = game.configuration.players[winner];
                winner = winner.name;
                return m('.game-winner-banner-container', [
                    m('.game-winner-banner',winner+" has won!"),
                    m('button.btn-restart', {onclick:TickTackToeView.startGame}, 'Start Again'),
                ])
            }
        }
    },
    Footer:{
        oncreate:()=>{
            // $('.btn-continue').unbind().click(TickTackToe.game.continue);
            // $('.btn-pause').unbind().click(TickTackToe.game.pause);
            // $('.btn-quit').unbind().click(TickTackToe.game.quit);
        },
        view: () => {
            if (game.getStatus() === 'paused') {
                return m('.game-header', [
                    m('button.btn-continue', {onclick:TickTackToeView.continueGame}, 'Continue'),
                    m('button.btn-quit', {onclick:TickTackToeView.quitGame},'Quit'),
                ])
            } else if (game.getStatus() === 'started' || game.getStatus() === 'continued') {
                return m('.game-header', [
                    m('button.btn-pause', {onclick:TickTackToeView.pauseGame}, 'Pause'),
                    m('button.btn-quit', {onclick:TickTackToeView.quitGame},'Quit'),
                ])
            } else {
                return m('.game-header', [
                    m('button.btn-quit', {onclick:TickTackToeView.quitGame},'Quit'),
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
        if(winner){
            console.log('winner', winner);
            return m('.game-controller', [
                m(TickTackToeView.Header),
                m(TickTackToeView.WinnerBanner, {winner},),
                m(TickTackToeView.Board),
                m(TickTackToeView.Footer),
            ])
        }else if(game.getStatus() === 'paused' || game.getStatus() === 'initialised' || game.getStatus() === 'quit'){
            return m('.game-controller',[
                m(TickTackToeView.Header),
                m(TickTackToeView.MainMenu),
            ])
        }else{
            return m('.game-controller', [
                m(TickTackToeView.Header),
                m(TickTackToeView.Board),
                m(TickTackToeView.Footer),
            ])
        }
    },
}

export default TickTackToeView;