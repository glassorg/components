const ts = require("typescript")
const fs = require("fs")
const path = require("path")

const copyrightNotice = `/***************************************************************
This file was generated automatically from lib.dom.d.ts,
which is distributed by Microsoft under the Apache 2.0 license. 
***************************************************************/
`

const DENT = "    "

const typeScriptDir = require.resolve("typescript")
const libDomPath = path.join(path.dirname(typeScriptDir), "lib.dom.d.ts")
const libDomSource = fs.readFileSync(libDomPath, { encoding: "utf-8" })

const interfaces = parseInterfaces(libDomSource)
const tagToElementInterface = interfaces.find(x => x.name === "HTMLElementTagNameMap")

fs.writeFileSync(
    "./output/elements.html.generated.ts",
    [
        copyrightNotice,
        `import { Constructor } from "../core/types.js";`,
        `import { HTMLElementProperties, HTMLElementTagNameMapExact } from "./elements.js";\n`,
        generate_HTMLProperties_source(),
        generate_HTMLPropertyMap_source(),
        generate_htmlElementToType_source(),
    ].join("\n"),
    { encoding: "utf-8" }
)

fs.writeFileSync(
    "./output/factories.html.ts",
    generate_exportFactories_source(),
    { encoding: "utf-8" }
)

function generate_HTMLProperties_source() {

    return interfaces
        .filter(x => isHTMLElementName(x.name) && x.name !== "HTMLElement")
        .map(elementInterfaceToPropertyInterface)
        // .filter(x => x.fields.length > 0)
        .map(interfaceObjToSource).join("\n")

    function elementInterfaceToPropertyInterface(
        elementInterface
    ) {
        let { name, comment, parentTypes, fields } = elementInterface
        return {
            name: elementToPropertiesType(name),
            comment,
            parentTypes: parentTypes.filter(isHTMLElementName).map(elementToPropertiesType),
            fields: fields.filter(field => !isArrowType(field.type))
        }
    }

}

function generate_HTMLPropertyMap_source() {
    let source = "export interface HTMLPropertyMap extends Record<keyof HTMLElementTagNameMapExact, HTMLElementProperties> {\n"
    for (let field of tagToElementInterface.fields) {
        let { name, type } = field
        let propertiesType = elementToPropertiesType(type)
        source += `${DENT}${name}: ${propertiesType},\n`
    }
    source += "}\n"
    return source
}

function generate_htmlElementToType_source() {
    let source = "export const htmlElementToType = {\n"
    for (let field of tagToElementInterface.fields) {
        let { name, type } = field
        source += `${DENT}${name}: ${type},\n`
    }
    source += "} as const satisfies { [K in keyof HTMLElementTagNameMap]?: Constructor<HTMLElementTagNameMap[K]> };\n"
    return source
}

function generate_exportFactories_source() {
    const bannedTagNames = ["var", "object"]
    let source = ""
    for (let field of tagToElementInterface.fields) {
        let { name, type } = field
        let exportName = name.charAt(0).toUpperCase() + name.slice(1)
        if (bannedTagNames.indexOf(name) > -1)
            exportName += "Tag"
        source += `export const ${exportName} = htmlElement("${name}");\n`
    }
    return source
}

function interfaceObjToSource(interfaceObj) {
    const { name, comment, parentTypes, fields } = interfaceObj

    let source = ""

    // if (comment)
    //     source += `/** ${interfaceObj.comment} */\n`

    source += `export interface ${name}`
    if (parentTypes.length > 0)
        source += ` extends ${parentTypes.join(", ")} `
    source += ' {\n'

    for (const field of fields) {
        if (field.comment)
            source += `${DENT}/** ${field.comment} */\n`
        source += `${DENT}${field.name}?: ${field.type}; \n`
    }

    source += '}\n'

    return source
}

function isHTMLElementName(name) {
    if (name === "HTMLOrSVGElement")
        return false
    return name.startsWith("HTML") && name.endsWith("Element")
}

function isArrowType(typeName) {
    return typeName.indexOf(") =>") > -1
}

function elementToPropertiesType(typeName) {
    if (typeName === "HTMLElement")
        return "HTMLElementProperties"
    return typeName.replace("Element", "Properties")
}

// === TS AST Helpers ================================== //

function parseInterfaces(
    source,
    filter = () => true
) {
    const node = ts.createSourceFile("source.ts", source)

    let interfaces = []
    foreachChild(node, "InterfaceDeclaration", child => {
        if (!filter(child) || isDeprecated(source, child))
            return

        let fields = []
        foreachChild(child, "PropertySignature", child => {
            if (isDeprecated(source, child) || isReadonly(child))
                return

            let field = {
                name: getName(child),
                type: getType(source, child),
                comment: getDocStringComment(source, child)
            }
            fields.push(field)

        })

        let interfaceObj = {
            name: getName(child),
            comment: getDocStringComment(source, child),
            parentTypes: getParentTypes(source, child),
            fields
        }
        interfaces.push(interfaceObj)

    })

    return interfaces
}

/**
 * 
 * @param { ts.Node } node 
 * @param { string } kindName
 * @param { (child: ts.Node) => void } callback 
 */
function foreachChild(node, kindName, callback) {
    node.forEachChild(child => {
        if (getKind(child) === kindName)
            callback(child)
    })
}

function getKind(node) {
    return ts.SyntaxKind[node.kind]
}

function getName(node) {
    return node.name.escapedText || node.name.text
}

function getType(source, node) {
    return getNodeSource(source, node.type).trim()
}

function getNodeSource(source, node) {
    let { pos, end } = node
    return source.substring(pos, end)
}

function getDocString(source, node) {
    if (!node.jsDoc || node.jsDoc.length == 0)
        return undefined
    return getNodeSource(source, node.jsDoc[0]).trim()
}

function getDocStringComment(source, node) {
    const nonContentTokens = /(\/\*\*)|(\*\/)|(\*)|(\[MDN Reference\]\(https:\/\/developer\.mozilla\.org(\/\w+)+\))/g
    let docString = getDocString(source, node)
    if (!docString)
        return undefined
    return docString
        .replaceAll(nonContentTokens, "")
        .replaceAll(/\s+/g, " ")
        .trim()
}

/** @param { ts.InterfaceDeclaration } node  */
function getParentTypes(source, node) {
    let types = []
    if (!node.heritageClauses)
        return types
    for (let clause of node.heritageClauses) {
        // console.log(getSource(source, clause))
        for (let type of clause.types) {
            types.push(getNodeSource(source, type).trim())
        }
    }
    return types
}

function isDeprecated(source, node) {
    let docString = getDocString(source, node)
    if (!docString)
        return false
    return docString.indexOf("@deprecated") > -1
}

function isReadonly(node) {
    if (!node.modifiers)
        return false
    for (let modifier of node.modifiers)
        if (getKind(modifier) === "ReadonlyKeyword")
            return true
    return false
}