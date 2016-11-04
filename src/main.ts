interface Record {
    tag: string;
    children: Record[];
    class: string;
    style: PropertyValue[];
}

interface PropertyValue {
    name: string;
    value: string;
}

let parse = (thing: HTMLElement): Record => {
    let element: Record = {
        tag: thing.nodeName.toLowerCase(),
        children: [],
        class: thing.className,
        style: []
    };

    if (thing.style.cssText) {
        for (let i = 0; i < thing.style.length; i++) {
            element.style.push({
                name: thing.style[i],
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
        attrs += ` style: [${source.style.map(({name, value}) => `${name}: "${value}"`).join(', ')}]`;
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
