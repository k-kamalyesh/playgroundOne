module.exports = class Player{
    constructor(playerName, playerColor, playerPosition=0){
        this.name(playerName);
        this.color(playerColor);
        this.position(playerPosition);
    }

    name(playerName){
        if(playerName){
            this._name = playerName;
        }
        return this._name;
    }

    color(playerColor){
        if(playerColor){
            this._color = playerColor;
        }
        return this._color;
    }

    position(playerPosition){
        if(!isNaN(playerPosition)){
            this._position = playerPosition;
        }
        return this._position;
    }
}