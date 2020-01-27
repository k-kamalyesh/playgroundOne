import m from "mithril";
import Routes from "./routes/index"
import GameList from "./routes/gamelist"

m.mount(document.getElementById("game-nav"), Routes.NavMenu);

m.route(document.getElementById("game-router"), "/home", {
    "/home": Routes.Home,
    "/about": Routes.About,
    "/help": Routes.Help,
    "/games/t3": GameList.TickTackToe,
    "/games/sl": GameList.SnakesLadders,
})