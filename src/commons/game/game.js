module.exports = class Game{
    constructor(configuration){
        this.settings(configuration);
        this.status='initialised';
    }

    settings(configuration){
        if(configuration){
            this.configuration = configuration;
        }
        console.log('Game configuration is ',this.configuration);
        return this.configuration;
    }

    start(){
        this.status='started';
        console.log('Game has started');
    }
    pause(){
        this.status='paused';
        console.log('Game has paused');
    }
    continue(){
        this.status='continued';
        console.log('Game is continued');
    }
    quit(){
        this.status='quit';
        console.log('Game has been quit');
    }
    playTurn(){
        console.log('Playing turn');
    }
    getStatus(){
        return this.status;
    }
}