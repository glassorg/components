
import * as svg from "../src/svg/elements.js";
import { div, span } from "../src/html/elements.js";

function helloWorld() {
    return div(
        span({ style: { color: "blue" } }, "Hello"),
        " ",
        span({ style: { color: "red" } }, "World")
    )
}

document.body.appendChild(helloWorld().build());
