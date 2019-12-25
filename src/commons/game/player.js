module.exports = class Player{
    constructor(name, color, position=0){
        this.name(name);
        this.color(color);
        this.position(position);
    }

    name(name){
        if(name){
            this.name = name;
        }
        return this.name;
    }

    color(color){
        if(color){
            this.color = color;
        }
        return this.color;
    }

    position(position){
        if(position){
            this.position = position;
        }
        return this.getPosition;
    }
}