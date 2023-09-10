import { extname } from "path";
import { Factory } from "../core/Factory.js";
import { Constructor, NoUnion } from "../core/types.js";
import { CreateFunction, ElementProperties } from "../dom/ElementFactory.js";
import { element } from "../dom/ElementFactory.js";
import { HTMLPropertyMap as HTMLPropertyMapGenerated, htmlElementToType } from "./elements.html.generated.js";
import "./events.js";

type HTMLElementProperties = ElementProperties;

interface HTMLCanvasProperties extends HTMLElementProperties {
    width: number;
    height: number;
}

type HTMLScriptPropertiesGenerated = HTMLPropertyMapGenerated["script"]
interface HTMLScriptProperties extends HTMLScriptPropertiesGenerated {
    children: Factory<Text>[];
    style?: never;
    className?: never;
    slot?: never;
}

// Here you can override generated property types with narrower types.
interface HTMLPropertyMap extends HTMLPropertyMapGenerated {
    canvas: HTMLCanvasProperties,
    script: HTMLScriptProperties,
}

function htmlElement<TagName extends keyof typeof htmlElementToType>(tagName: NoUnion<TagName>) {
    return element<HTMLElementTagNameMap[TagName], HTMLPropertyMap[TagName]>("http://www.w3.org/1999/xhtml", tagName, htmlElementToType[tagName] as Constructor<HTMLElementTagNameMap[TagName]>);
}

type HTMLElements = { [K in keyof HTMLElementTagNameMap]: CreateFunction<HTMLElementTagNameMap[K], HTMLPropertyMap[K]> };

export const elements = Object.fromEntries(
    Object.keys(htmlElementToType).map(
        key => [key, htmlElement(key as NoUnion<keyof typeof htmlElementToType>)]
    )
) as unknown as HTMLElements;
