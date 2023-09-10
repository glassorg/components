import { Factory } from "../core/Factory.js";
import { Constructor, NoUnion } from "../core/types.js";
import { ElementProperties } from "../dom/ElementFactory.js";
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

export const a = htmlElement("a");
export const abbr = htmlElement("abbr");
export const address = htmlElement("address");
export const area = htmlElement("area");
export const article = htmlElement("article");
export const aside = htmlElement("aside");
export const audio = htmlElement("audio");
export const b = htmlElement("b");
export const base = htmlElement("base");
export const bdi = htmlElement("bdi");
export const bdo = htmlElement("bdo");
export const blockquote = htmlElement("blockquote");
export const body = htmlElement("body");
export const br = htmlElement("br");
export const button = htmlElement("button");
export const canvas = htmlElement("canvas");
export const caption = htmlElement("caption");
export const cite = htmlElement("cite");
export const code = htmlElement("code");
export const col = htmlElement("col");
export const colgroup = htmlElement("colgroup");
export const data = htmlElement("data");
export const datalist = htmlElement("datalist");
export const dd = htmlElement("dd");
export const del = htmlElement("del");
export const details = htmlElement("details");
export const dfn = htmlElement("dfn");
export const dialog = htmlElement("dialog");
export const div = htmlElement("div");
export const dl = htmlElement("dl");
export const dt = htmlElement("dt");
export const em = htmlElement("em");
export const embed = htmlElement("embed");
export const fieldset = htmlElement("fieldset");
export const figcaption = htmlElement("figcaption");
export const figure = htmlElement("figure");
export const footer = htmlElement("footer");
export const form = htmlElement("form");
export const h1 = htmlElement("h1");
export const h2 = htmlElement("h2");
export const h3 = htmlElement("h3");
export const h4 = htmlElement("h4");
export const h5 = htmlElement("h5");
export const h6 = htmlElement("h6");
export const head = htmlElement("head");
export const header = htmlElement("header");
export const hgroup = htmlElement("hgroup");
export const hr = htmlElement("hr");
export const html = htmlElement("html");
export const rt = htmlElement("rt");
export const ruby = htmlElement("ruby");
export const s = htmlElement("s");
export const samp = htmlElement("samp");
export const script = htmlElement("script");
export const search = htmlElement("search");
export const section = htmlElement("section");
export const select = htmlElement("select");
export const slot = htmlElement("slot");
export const small = htmlElement("small");
export const source = htmlElement("source");
export const span = htmlElement("span");
export const strong = htmlElement("strong");
export const style = htmlElement("style");
export const sub = htmlElement("sub");
export const summary = htmlElement("summary");
export const sup = htmlElement("sup");
export const table = htmlElement("table");
export const tbody = htmlElement("tbody");
export const td = htmlElement("td");
export const template = htmlElement("template");
export const textarea = htmlElement("textarea");
export const tfoot = htmlElement("tfoot");
export const th = htmlElement("th");
export const thead = htmlElement("thead");
export const time = htmlElement("time");
export const title = htmlElement("title");
export const tr = htmlElement("tr");
export const track = htmlElement("track");
export const u = htmlElement("u");
export const ul = htmlElement("ul");
export const variable = htmlElement("var");
export const video = htmlElement("video");
export const wbr = htmlElement("wbr");