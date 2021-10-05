// type Listeners = { [M in keyof (HTMLElementEventMap & SVGSVGElementEventMap)]?: (this: HTMLElement, e: (HTMLElementEventMap & SVGSVGElementEventMap)[M]) => void }
/**
 * @type {{ [M in keyof (HTMLElementEventMap & SVGSVGElementEventMap)]?: (this: HTMLElement, e: (HTMLElementEventMap & SVGSVGElementEventMap)[M]) => void }} Listeners
 */

// export function El<T>(tagName: string, options?: {
//     classes?: string[], cls?: string,
//     id?: string, fields?: T, attributes?: { [index: string]: string | { toString(): string } }, listeners?: Listeners
// }, ...children: (string | Node)[]): T & HTMLElement;
/**
 * @template T
 * @param {keyof HTMLElementTagNameMap} tagName 
 * @param {{classes?: string[], cls?: string, id?: string, attributes: {[index: string]: string | { toString(): string }}, listeners: Listeners}} options 
 * @param  {...string | Node} children 
 */
function El(tagName, options = {}, ...children) {
    let el = Object.assign(document.createElement(tagName), options.fields || {});
    if (options.classes && options.classes.length) el.classList.add(...options.classes);
    else if (options.cls) el.classList.add(options.cls);
    if (options.id) el.id = options.id;
    el.append(...children.filter(el => el));
    for (let listenerName of Object.keys(options.listeners || {}))
        if (options.listeners[listenerName]) el.addEventListener(listenerName, options.listeners[listenerName], false);
    for (let attributeName of Object.keys(options.attributes || {})) {
        if (options.attributes[attributeName] !== undefined) el.setAttribute(attributeName, options.attributes[attributeName]);
    }
    return el;
}

/**
 * 
 * @param {Element} el 
 * @param {string | string[]} [prop] 
 * @param {CSSStyleDeclaration} style 
 * @returns {number}
 */
function timeToTransition(el, prop, style = getComputedStyle(el)) {
    if (prop instanceof Array) {
        if (prop.length === 1) return [timeToTransition(el, prop[0])];
        let props = style.transitionProperty.split(",");
        let indexArr = prop.map(props.indexOf.bind(props));
        let durs = style.transitionDuration.split(",");
        let delays = style.transitionDelay.split(",");
        return indexArr.map((i) => (parseFloat(durs[i]) + parseFloat(delays[i])) * 1000);
    }
    if (typeof prop === "string") {
        prop = prop.replace(/[A-Z]/, (c) => `-${c.toLowerCase()}`);
        let durs = style.transitionDuration.split(",");
        let delays = style.transitionDelay.split(",");
        let index = style.transitionProperty.trim().split(/ *, */).indexOf(prop);
        return index === -1 ? 0 : (parseFloat(durs[index] || durs[0]) + parseFloat(delays[index] || delays[0])) * 1000
    }
    return (parseFloat(style.transitionDuration) + parseFloat(style.transitionDelay)) * 1000;
}