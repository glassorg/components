
import * as svg from "../src/svg/elements.js";

import { HTMLElementProperties, Button, Div, Span, Style } from "../src/html/elements.js";
import { customElement } from "../src/html/CustomElementFactory.js";
import { useState } from "../src/hooks/useState.js";

interface MyCustomProps extends HTMLElementProperties {
    name: string
}

const helloFunctional = customElement((props: MyCustomProps) => {
    const [count, setCount] = useState(0);
    const { name, ...rest } = props;
    return Span(
        rest,
        Style(`
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
        Span(`Hello ${name} ${count}`),
        Button({
            events: {
                click(e) {
                    setCount(count + 2);
                }
            }
        }, "Click Me")
    );
}, { shadow: true });

const growButton = customElement(function ({ children }) {
    return Button({
        events: {
            click: (e) => {
                this.style.width = `${this.clientWidth + 10}px`;
                this.style.height = `${this.clientHeight + 10}px`;
            }
        }
    }, ...children);
}, { extends: "button" });

function helloWorld() {
    return Div(
        Span("Hello"),
        " ",
        Span({ style: { color: "red" } }, "World"),
        helloFunctional({ name: "Functional" }, "hello functional content"),
        growButton("Click to Grow"),
    )
}

document.body.appendChild(helloWorld().build());

