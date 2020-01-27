module.exports = class Dice{
    constructor(maxSides=6){
        this.maxSides=maxSides;
    }
    rollTheDice(){
        return (Math.floor(Math.random()*this.maxSides)+1);
    }
}