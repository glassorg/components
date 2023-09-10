
import * as svg from "../src/svg/elements.js";
import { HTMLElementProperties, button, div, span } from "../src/html/elements.js";
import { customElement } from "../src/html/CustomElementFactory.js";
import { useState } from "../src/hooks/useState.js";

interface MyCustomProps extends HTMLElementProperties {
    name: string
}

const helloFunctional = customElement((props: MyCustomProps) => {
    const [count, setCount] = useState(0);
    const { name, style, ...rest } = props;
    return span(
        span({ ...rest, style: { color: "orange", display: "block", ...style } }, `Hello ${name} ${count}`),
        button({
            onclick() {
                setCount(count + 1);
            }
        } as any, "Click Me")
    );
},);

function helloWorld() {
    return div(
        span({ style: { color: "blue" } }, "Hello"),
        " ",
        span({ style: { color: "red" } }, "World"),
        helloFunctional({ name: "Functional" }, "hello functional content")
    )
}

document.body.appendChild(helloWorld().build());

