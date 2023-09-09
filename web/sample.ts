
import * as svg from "../src/svg/elements.js";
import { div, script, span } from "../src/html/elements.js";

function helloWorld() {
    return div(
        span("Foo"),
        span({ style: { color: "blue" } }, "Hello"),
        " ",
        span({ style: { color: "red" } }, "World"),
        script(`
            console.log("Logging from my custom script");
        `)
    )
}

document.body.appendChild(helloWorld().build());
