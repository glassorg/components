
import { BabylonSample } from "../babylon/private/sample.js";
import { Factory } from "../components/Factory.js";
import { H2, P, Section } from "../html/elements.js";
import { HTMLSample } from "../html/private/sample.js";

function addSample(name: string, sample: () => Factory<HTMLElement>) {
    document.body.appendChild(Section(
        H2(name),
        P(
            sample()
        )
    ).build())
}

const samples = {
    "HTML": HTMLSample,
    "Babylon": BabylonSample,
}

Object.entries(samples).forEach(entry => addSample(...entry))

