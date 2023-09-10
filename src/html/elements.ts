import { Factory } from "../core/Factory.js";
import { Constructor, NoUnion } from "../core/types.js";
import { CreateFunction, ElementProperties } from "../dom/ElementFactory.js";
import { element } from "../dom/ElementFactory.js";
import { htmlElementToType, HTMLPropertyMap as HTMLPropertyMapGenerated } from "./elements.html.generated.js";
import "./events.js";

export type HTMLElementProperties = ElementProperties;

export type HTMLElementTagNameMapExact = { [Key in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[Key] & { tagName: Key } };

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

interface HTMLStyleProperties extends HTMLElementProperties {
    media?: string;
    disabled?: boolean;
    children: Factory<Text>[];
}

// Here you can override generated property types with narrower types.
interface HTMLPropertyMap extends HTMLPropertyMapGenerated {
    canvas: HTMLCanvasProperties,
    script: HTMLScriptProperties,
    style: HTMLStyleProperties
}

function htmlElement<TagName extends keyof typeof htmlElementToType>(tagName: NoUnion<TagName>) {
    return element<HTMLElementTagNameMapExact[TagName], HTMLPropertyMap[TagName]>(
        "http://www.w3.org/1999/xhtml",
        tagName,
        htmlElementToType[tagName] as Constructor<HTMLElementTagNameMapExact[TagName]>
    );
}

type HTMLElements = { [K in keyof HTMLElementTagNameMapExact]: CreateFunction<HTMLElementTagNameMapExact[K], HTMLPropertyMap[K]> };

export const html = Object.fromEntries(
    Object.keys(htmlElementToType).map(
        key => [key, htmlElement(key as NoUnion<keyof typeof htmlElementToType>)]
    )
) as unknown as HTMLElements;
