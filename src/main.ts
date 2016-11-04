interface Record {
    tag: string;
    children: Record[];
    class: string;
    style: PropertyValue[];
}

interface PropertyValue {
    property: string;
    value: string;
}

// taken from https://github.com/witheve/Eve/blob/4fecae43c108a54d0a4b97b1157ce74c68834e91/src/renderer.ts#L44-L52
let supportedTags : { [tag: string]: boolean; } = {
  "div": true, "span": true, "input": true, "ul": true, "li": true, "label": true, "button": true, "header": true, "footer": true, "a": true, "strong": true,
  "h1": true, "h2": true, "h3": true, "h4": true, "h5": true, "h6": true,
  "ol": true, "p": true, "pre": true, "em": true, "img": true, "canvas": true, "script": true, "style": true, "video": true,
  "table": true, "tbody": true, "thead": true, "tr": true, "th": true, "td": true,
  "form": true, "optgroup": true, "option": true, "select": true, "textarea": true,
  "title": true, "meta": true, "link": true,
  "svg": true, "circle": true, "line": true, "rect": true, "polygon":true, "text": true, "image": true, "defs": true, "pattern": true, "linearGradient": true, "g": true, "path": true
};

// taken from https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements
let inlineElements : { [tag: string]: boolean; } = {
  "b": true,
  "big": true,
  "i": true,
  "small": true,
  "tt": true,
  "abbr": true,
  "acronym": true,
  "cite": true,
  "code": true,
  "dfn": true,
  "em": true,
  "kbd": true,
  "strong": true,
  "samp": true,
  "time": true,
  "var": true,
  "a": true,
  "bdo": true,
  "br": true,
  "img": true,
  "map": true,
  "object": true,
  "q": true,
  "script": true,
  "span": true,
  "sub": true,
  "sup": true,
  "button": true,
  "input": true,
  "label": true,
  "select": true,
  "textarea": true
};

let parse = (thing: HTMLElement): Record => {
    let tag = thing.nodeName.toLowerCase();

    if (!supportedTags[tag]) {
        let newTag = inlineElements[tag] ? 'span' : 'div';
        console.warn(`<${tag}> tag not supported by Eve, using [#${newTag}]`);
        tag = newTag;
    }

    let element: Record = {
        tag,
        children: [],
        class: thing.className,
        style: []
    };

    if (thing.style.cssText) {
        for (let i = 0; i < thing.style.length; i++) {
            element.style.push({
                property: thing.style[i],
                value: thing.style.getPropertyValue(thing.style[i])
            });
        }
    };

    if (thing.childNodes) {
        for(let i = 0; i < thing.childNodes.length; i++) {
            element.children.push(parse(<HTMLElement>thing.childNodes[i]));
        }
    }

    return element;
};

let repeat = (s: string, num: number) =>
    new Array(num + 1).join(s);
let indent = (level: number): string =>
    repeat(' ', level * 2);

let stringify = (source: Record, level: number = 0): string => {
    let attrs = '';

    if (source.class) {
        attrs += ` class: "${source.class}"`;
    }

    if (source.style.length) {
        attrs += ` style: [${source.style.map(({property, value}) => `${property}: "${value}"`).join(', ')}]`;
    }

    if (source.children.length) {
        let children = source.children.map(child =>
            stringify(child, level + 1)).join(`\n${indent(level + 1)}`
        );

        return `[#${source.tag}${attrs} children:\n${indent(level + 1)}${children}\n${indent(level)}]`;
    } else {
        return `[#${source.tag}${attrs}]`;
    }
};

let convertDocument = (str: string): string => {
    return stringify(parse(new DOMParser().parseFromString(str, "text/html").body));
};

// convertDocument('<img src="//" onerror="console.log(\'You are pwned!\')" />');

let test = `<div id="elm"><div class="main-button"><i class="fa fa-close fa-3x" style="transform: rotate(-0.785398rad);"></i><div class="message" style="display: block; opacity: 0;"></div><div class="child-button" style="transform: rotate(1.75929rad) translateY(0px) rotate(-1.75929rad); background-color: rgb(238, 238, 236);"><i class="fa  fa-lg fa-pencil"></i></div><div class="child-button" style="transform: rotate(2.45044rad) translateY(0px) rotate(-2.45044rad); background-color: rgb(238, 238, 236);"><i class="fa  fa-lg fa-at"></i></div><div class="child-button" style="transform: rotate(3.14159rad) translateY(0px) rotate(-3.14159rad); background-color: rgb(238, 238, 236);"><i class="fa  fa-lg fa-camera"></i></div><div class="child-button" style="transform: rotate(3.83274rad) translateY(0px) rotate(-3.83274rad); background-color: rgb(238, 238, 236);"><i class="fa  fa-lg fa-bell"></i></div><div class="child-button" style="transform: rotate(4.52389rad) translateY(0px) rotate(-4.52389rad); background-color: rgb(238, 238, 236);"><i class="fa  fa-lg fa-comment"></i></div></div></div>`;

console.log(convertDocument(test));
