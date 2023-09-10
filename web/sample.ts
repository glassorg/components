
import * as svg from "../src/svg/elements.js";
import * as html from "../src/html/elements.js";
import { customElement } from "../src/html/CustomElementFactory.js";
import { useState } from "../src/hooks/useState.js";

interface MyCustomProps extends html.HTMLElementProperties {
    name: string
}

const helloFunctional = customElement((props: MyCustomProps) => {
    const [count, setCount] = useState(0);
    const { name, ...rest } = props;
    return html.span(
        rest,
        html.style(`
        :host {
            display: block;
            background: blue;
            padding: 4px;
            border-radius: 8px;
        }
        span {
            color: orange;
        }
        `),
        html.span(`Hello ${name} ${count}`),
        html.button({
            events: {
                click(e) {
                    setCount(count + 2);
                }
            }
        }, "Click Me")
    );
}, { shadow: true });

const growButton = customElement(function ({ children }) {
    return html.button({
        events: {
            click: (e) => {
                this.style.width = `${this.clientWidth + 10}px`;
                this.style.height = `${this.clientHeight + 10}px`;
            }
        }
    }, ...children);
}, { extends: "button" });

function helloWorld() {
    return html.div(
        html.span("Hello"),
        " ",
        html.span({ style: { color: "red" } }, "World"),
        helloFunctional({ name: "Functional" }, "hello functional content"),
        growButton("Click to Grow"),
    )
}

document.body.appendChild(helloWorld().build());

