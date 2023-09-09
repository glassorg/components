const ts = require("typescript")
const fs = require("fs")
const path = require("path")

const copyrightNotice = `/***************************************************************
This file was generated automatically from lib.dom.d.ts,
which is distributed by Microsoft under the Apache 2.0 license. 
***************************************************************/
`

const debug = false

const typeScriptDir = require.resolve("typescript")
const libDomPath = path.join(path.dirname(typeScriptDir), "lib.dom.d.ts")
const libDomSource = fs.readFileSync(libDomPath, { encoding: "utf-8" })

fs.writeFileSync(
    "./output/propertyInterfaces.ts",
    `${copyrightNotice}\n${generateInterfaceSource()}\n${getFactorySource()}`,
    { encoding: "utf-8" }
)

function generateInterfaceSource() {
    let elementInterfaces = parseInterfaces(libDomSource, node => isHTMLElementName(getName(node)))
    if (debug) {
        fs.writeFileSync(
            "./output/elementInterfaces.json",
            JSON.stringify(elementInterfaces, null, 2),
            { encoding: "utf-8" }
        )
    }
    let propertyInterfaces = elementInterfaces.map(elementInterfaceToPropertyInterface)
    if (debug) {
        fs.writeFileSync(
            "./output/propertyInterfaces.json",
            JSON.stringify(propertyInterfaces, null, 2),
            { encoding: "utf-8" }
        )
    }
    return propertyInterfaces.map(interfaceObjToSource).join("\n")
}

function getFactorySource() {
    let tagToElementInterface = parseInterfaces(libDomSource, node => getName(node) === "HTMLElementTagNameMap")[0]
    let source = ""
    for (let field of tagToElementInterface.fields) {
        let { name, type } = field
        let propertiesType = elementToPropertiesType(type)
        source += `export const ${name} = ElementFactory.createFunction<${type}, ${propertiesType}>(html, "${name}", ${type});\n`
    }
    return source
}


// ===================================================== //

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

function interfaceObjToSource(interfaceObj) {
    const DENT = "    "

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
        source += `${DENT}${field.name}: ${field.type}; \n`
    }

    source += '}\n'

    return source
}

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

// ===================================================== //

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

// ===================================================== //

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