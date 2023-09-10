import { extname } from "path";
import { Factory } from "../core/Factory.js";
import { Constructor, NoUnion } from "../core/types.js";
import { CreateFunction, ElementProperties } from "../dom/ElementFactory.js";
import { element } from "../dom/ElementFactory.js";
import { HTMLPropertyMap as HTMLPropertyMapGenerated, htmlElementToType } from "./elements.html.generated.js";
import "./events.js";

export type HTMLElementProperties = ElementProperties;

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

/* incoming from main

interface HTMLStyleElementProperties extends HTMLElementProperties {
    media?: string;
    disabled?: boolean;
    children: Factory<Text>[];
}

export type HTMLElementTagNameMapExact = { [Key in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[Key] & { tagName: Key } };

//  define the property types for each tag in this map.
interface HTMLPropertyMap extends Record<keyof HTMLElementTagNameMapExact, HTMLElementProperties> {
    div: HTMLElementProperties,
    span: HTMLElementProperties,
    input: HTMLInputProperties,
    textarea: HTMLTextAreaProperties,
    button: HTMLButtonProperties,
    canvas: HTMLCanvasProperties,
    script: HTMLScriptElementProperties,
    style: HTMLStyleElementProperties,
}

export const htmlElementToType = {
    span: HTMLSpanElement,
    div: HTMLDivElement,
    input: HTMLInputElement,
    form: HTMLFormElement,
    textarea: HTMLTextAreaElement,
    button: HTMLButtonElement,
    canvas: HTMLCanvasElement,
    script: HTMLScriptElement,
    style: HTMLStyleElement,
} as const satisfies { [K in keyof HTMLElementTagNameMapExact]?: Constructor<HTMLElementTagNameMap[K]> };

function htmlElement<TagName extends keyof typeof htmlElementToType>(tagName: NoUnion<TagName>) {
    return element<HTMLElementTagNameMapExact[TagName], HTMLPropertyMap[TagName]>("http://www.w3.org/1999/xhtml", tagName, htmlElementToType[tagName] as Constructor<HTMLElementTagNameMapExact[TagName]>);
}

export const div = htmlElement("div");
export const span = htmlElement("span");
export const input = htmlElement("input");
export const textarea = htmlElement("textarea");
export const button = htmlElement("button");
export const canvas = htmlElement("canvas");
export const script = htmlElement("script");
export const style = htmlElement("style");

incoming from main */

// Here you can override generated property types with narrower types.
interface HTMLPropertyMap extends HTMLPropertyMapGenerated {
    canvas: HTMLCanvasProperties,
    script: HTMLScriptProperties,
}

function htmlElement<TagName extends keyof typeof htmlElementToType>(tagName: NoUnion<TagName>) {
    return element<HTMLElementTagNameMap[TagName], HTMLPropertyMap[TagName]>(
        "http://www.w3.org/1999/xhtml",
        tagName,
        htmlElementToType[tagName] as Constructor<HTMLElementTagNameMap[TagName]>
    );
}

type HTMLElements = { [K in keyof HTMLElementTagNameMap]: CreateFunction<HTMLElementTagNameMap[K], HTMLPropertyMap[K]> };

export const elements = Object.fromEntries(
    Object.keys(htmlElementToType).map(
        key => [key, htmlElement(key as NoUnion<keyof typeof htmlElementToType>)]
    )
) as unknown as HTMLElements;
