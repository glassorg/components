
import * as svg from "../src/svg/elements.js";
import { elements } from "../src/html/elements.js";

const { div, span, canvas, script } = elements

function helloWorld() {
    return div(
        span({ style: { color: "blue" } }, "Hello"),
        " ",
        span({ style: { color: "red" } }, "World"),
        script(`console.log("Logging from my custom script");`),
        canvas({ width: 100, height: 100 })
    )
}

document.body.appendChild(helloWorld().build());

customElements.define("custom-test", class CustomTest extends HTMLElement {
});
