import { Factory } from "../core/Factory.js";
import { ElementFactory, ElementProperties } from "../dom/ElementFactory.js";

const svg = "http://www.w3.org/2000/svg";

type SVGElementProperties = ElementProperties<SVGElement>;

interface SVGCircleProperties extends SVGElementProperties {
    cx: number
    cy: number
    r: number
    children: Factory<SVGElement>[]
}

export const circle = ElementFactory.createFunction<SVGCircleElement, SVGCircleProperties>(svg, "circle", SVGCircleElement);