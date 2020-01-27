import m from "mithril"

let NavMenu = {
    view: function (){
        return m("game-nav", [
            m(m.route.Link, {href: "/home"}, "Home"),
            m(m.route.Link, {href: "/help"}, "Help"),
            m(m.route.Link, {href: "/about"}, "About"),
            m("game-routes", [
                m("p", "Games"),
                m(m.route.Link, {href: "/games/t3"}, "T3"),
                m(m.route.Link, {href: "/games/sl"}, "SnakesLadders"),
            ])
        ])
    }
}

let Home = {
    view: function(){
        return m("home", "this is home");
    }
}

let Help = {
    view: function(){
        return m("help", "this is help");
    }
}

let About = {
    view: function(){
        return m("about", "this is about");
    }
}

export default {
    Home, About, Help, NavMenu
}