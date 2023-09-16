import { Constructor, NoUnion } from "../components/private/types.js"
import { ElementProperties, element } from "./private/ElementFactory.js"
import { htmlElementToType, HTMLPropertyMap as HTMLPropertyMapGenerated } from "./private/elements.html.generated.js"
import "./private/events.js";
import { HTMLElementTagNameMapExact } from "./private/types.js"
import "./private/events.js";
import { Factory } from "../components/Factory.js";
export * from "./private/types.js"

export type HTMLElementProperties = ElementProperties;

export interface HTMLCanvasProperties extends HTMLElementProperties {
    width: number;
    height: number;
}

type HTMLScriptPropertiesGenerated = HTMLPropertyMapGenerated["script"]
export interface HTMLScriptProperties extends HTMLScriptPropertiesGenerated {
    children: Factory<Text>[];
    style?: never;
    className?: never;
    slot?: never;
}

export interface HTMLStyleProperties extends HTMLElementProperties {
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

//  Code to automatically generate them if we want to export a single object.
// type ElementFactories = { [K in Capitalize<StringKeyof<HTMLElementTagNameMap>>]: CreateFunction<HTMLElementTagNameMap[Lowercase<K>], HTMLPropertyMap[Lowercase<K>]> };
// export const elements = Object.fromEntries(Object.keys(htmlElementToType).map(tagName => [tagName[0].toUpperCase() + tagName.slice(1), htmlElement(tagName as any)])) as ElementFactories;

export const A = htmlElement("a")
export const Abbr = htmlElement("abbr")
export const Address = htmlElement("address")
export const Area = htmlElement("area")
export const Article = htmlElement("article")
export const Aside = htmlElement("aside")
export const Audio = htmlElement("audio")
export const B = htmlElement("b")
export const Base = htmlElement("base")
export const Bdi = htmlElement("bdi")
export const Bdo = htmlElement("bdo")
export const Blockquote = htmlElement("blockquote")
export const Body = htmlElement("body")
export const Br = htmlElement("br")
export const Button = htmlElement("button")
export const Canvas = htmlElement("canvas")
export const Caption = htmlElement("caption")
export const Cite = htmlElement("cite")
export const Code = htmlElement("code")
export const Col = htmlElement("col")
export const Colgroup = htmlElement("colgroup")
export const Data = htmlElement("data")
export const Datalist = htmlElement("datalist")
export const Dd = htmlElement("dd")
export const Del = htmlElement("del")
export const Details = htmlElement("details")
export const Dfn = htmlElement("dfn")
export const Dialog = htmlElement("dialog")
export const Div = htmlElement("div")
export const Dl = htmlElement("dl")
export const Dt = htmlElement("dt")
export const Em = htmlElement("em")
export const Embed = htmlElement("embed")
export const Fieldset = htmlElement("fieldset")
export const Figcaption = htmlElement("figcaption")
export const Figure = htmlElement("figure")
export const Footer = htmlElement("footer")
export const Form = htmlElement("form")
export const H1 = htmlElement("h1")
export const H2 = htmlElement("h2")
export const H3 = htmlElement("h3")
export const H4 = htmlElement("h4")
export const H5 = htmlElement("h5")
export const H6 = htmlElement("h6")
export const Head = htmlElement("head")
export const Header = htmlElement("header")
export const Hgroup = htmlElement("hgroup")
export const Hr = htmlElement("hr")
export const Html = htmlElement("html")
export const I = htmlElement("i")
export const Iframe = htmlElement("iframe")
export const Img = htmlElement("img")
export const Input = htmlElement("input")
export const Ins = htmlElement("ins")
export const Kbd = htmlElement("kbd")
export const Label = htmlElement("label")
export const Legend = htmlElement("legend")
export const Li = htmlElement("li")
export const Link = htmlElement("link")
export const Main = htmlElement("main")
export const Map = htmlElement("map")
export const Mark = htmlElement("mark")
export const Menu = htmlElement("menu")
export const Meta = htmlElement("meta")
export const Meter = htmlElement("meter")
export const Nav = htmlElement("nav")
export const Noscript = htmlElement("noscript")
export const ObjectTag = htmlElement("object")
export const Ol = htmlElement("ol")
export const Optgroup = htmlElement("optgroup")
export const Option = htmlElement("option")
export const Output = htmlElement("output")
export const P = htmlElement("p")
export const Picture = htmlElement("picture")
export const Pre = htmlElement("pre")
export const Progress = htmlElement("progress")
export const Q = htmlElement("q")
export const Rp = htmlElement("rp")
export const Rt = htmlElement("rt")
export const Ruby = htmlElement("ruby")
export const S = htmlElement("s")
export const Samp = htmlElement("samp")
export const Script = htmlElement("script")
export const Search = htmlElement("search")
export const Section = htmlElement("section")
export const Select = htmlElement("select")
export const Slot = htmlElement("slot")
export const Small = htmlElement("small")
export const Source = htmlElement("source")
export const Span = htmlElement("span")
export const Strong = htmlElement("strong")
export const Style = htmlElement("style")
export const Sub = htmlElement("sub")
export const Summary = htmlElement("summary")
export const Sup = htmlElement("sup")
export const Table = htmlElement("table")
export const Tbody = htmlElement("tbody")
export const Td = htmlElement("td")
export const Template = htmlElement("template")
export const Textarea = htmlElement("textarea")
export const Tfoot = htmlElement("tfoot")
export const Th = htmlElement("th")
export const Thead = htmlElement("thead")
export const Time = htmlElement("time")
export const Title = htmlElement("title")
export const Tr = htmlElement("tr")
export const Track = htmlElement("track")
export const U = htmlElement("u")
export const Ul = htmlElement("ul")
export const VarTag = htmlElement("var")
export const Video = htmlElement("video")
export const Wbr = htmlElement("wbr");
