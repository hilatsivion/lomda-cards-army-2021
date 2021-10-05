type Listeners = { [M in keyof (HTMLElementEventMap & SVGSVGElementEventMap)]?: (this: HTMLElement, e: (HTMLElementEventMap & SVGSVGElementEventMap)[M]) => void }

export function El<T>(tagName: string, options?: {
    classes?: string[], cls?: string,
    id?: string, fields?: T, attributes?: { [index: string]: string | { toString(): string } }, listeners?: Listeners
}, ...children: (string | Node)[]): T & HTMLElement;

export function El<T, K extends keyof HTMLElementTagNameMap>(tagName: K, options: {
    classes?: string[], cls?: string,
    id?: string, fields?: T, attributes?: any, listeners?: Listeners
} = {}, ...children: (string | Element)[]): Partial<T> & HTMLElementTagNameMap[K] {
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

export async function transition(el: HTMLElement, prop: keyof stringOnlyStyle, value?: string | ((el: HTMLElement) => void)): Promise<HTMLElement> {
    let time = timeToTransition(el, prop);
    return new Promise(cb => {
        if (value) {
            if (typeof value === "string")
                el.style[prop] = value;
            else value(el);
        }
        setTimeout(cb.bind(undefined, el), time);
    })
}

type OfType<T, VT, K extends keyof T = keyof T> = {
    [M in K]: T[M] extends never ? never : T[M] extends VT ? M : never;
};

type ValueOf<T> = T[keyof T];
type AllFieldsOfType<T, KT> = Pick<T, ValueOf<OfType<T, KT>>>
type PureStyle = AllFieldsOfType<CSSStyleDeclaration, string>;
type stringOnlyStyle = Pick<CSSStyleDeclaration, ValueOf<OfType<OfType<CSSStyleDeclaration, string>, string>>>;

export function restyle(el: Element, { css = {}, reset = [], clsAdd, clsRemove, clsSet }: { css?: Partial<PureStyle>, reset?: (keyof PureStyle)[], clsAdd?: string | string[], clsRemove?: string | string[], clsSet?: string | string[] }, reflow?: boolean) {
    if (clsAdd || clsRemove) {
        el.classList.add(...clsAdd instanceof Array ? clsAdd : [clsAdd]);
        el.classList.remove(...clsRemove instanceof Array ? clsRemove : [clsRemove]);
    } else if (clsSet) {
        if (clsSet instanceof Array) {
            el.className = "";
            el.classList.add(...clsSet);
        } else
            el.className = clsSet;
    }
    if (el instanceof HTMLElement) {
        for (let cssProp of Object.keys(css)) el.style[cssProp] = css[cssProp] || "";
        for (let cssProp of reset) el.style[cssProp] = "";
    }
    if (reflow) el.clientWidth;
}

export function timeToTransition<T extends string | string[] | undefined = undefined>(el: Element, prop?: T, style?: CSSStyleDeclaration): T extends Array<string> ? T extends undefined ? number : number[] : number;
export function timeToTransition(el: Element, prop?: string | string[], style: CSSStyleDeclaration = getComputedStyle(el)) {
    if (prop instanceof Array) {
        if (prop.length === 1) return [timeToTransition(el, prop[0])];
        let props = style.transitionProperty.split(",");
        let indexArr = prop.map(props.indexOf.bind(props));
        let durs = style.transitionDuration.split(",");
        let delays = style.transitionDelay.split(",");
        return indexArr.map((i: number) => (parseFloat(durs[i]) + parseFloat(delays[i])) * 1000);
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

export function animateDims(el: HTMLElement & { resizeToken?: number }, shrink: boolean, dim: "width" | "height" | "width&height") {
    if (el.resizeToken) clearTimeout(el.resizeToken);
    let resizeListener = (_e?: Event, height?: number | string, width?: number | string) => {
        if (dim.indexOf("height") !== -1)
            el.style.maxHeight = `${height !== undefined ? height : `${el.scrollHeight}px`}`;
        if (dim.indexOf("width") !== -1)
            el.style.maxWidth = `${width !== undefined ? width : `${el.scrollWidth}px`}`;
    }
    resizeListener();
    window.addEventListener("resize", resizeListener, false);
    if (shrink) {
        void el.offsetWidth;
        resizeListener(undefined, "", "");
        el.style.overflow = "";
    }
    let time = timeToTransition(el, dim.split("&").map(s => `max-${s}`)).reduce((n1, n2) => Math.max(n1, n2 || 0), 0);
    el.resizeToken = setTimeout(() => {
        window.removeEventListener("resize", resizeListener, false);
        el.resizeToken = undefined;
        if (!shrink) {
            resizeListener(undefined, "unset", "unset");
            el.style.overflow = "visible";
        }
    }, time);
}

if (!("DOMRect" in window)) {
    window.DOMRect = ClientRect as any;
    Object.defineProperties(window.DOMRect.prototype, {
        x: {
            get() {
                return this.left;
            }, set(value) {
                this.left = value;
            }
        },
        y: {
            get() {
                return this.top;
            }, set(value) {
                this.top = value;
            }
        },
        width: {
            get() {
                return this.right - this.left;
            },
            set(value) {
                this.right = value + this.left;
            }
        },
        height: {
            get() {
                return this.bottom - this.top;
            },
            set(value) {
                this.bottom = value + this.top;
            }
        },
        toJSON: {
            value() {
                return Object.assign({}, this);
            }
        }
    });
}


DOMRect.prototype.intersection = function intersection({ left, top, right, bottom }) {
    let y = Math.max(this.top, top);
    let x = Math.max(this.left, left);
    let res = ((Math.min(this.right, right) - x) * (Math.min(this.bottom, bottom) - y)) / Math.min(this.width * this.height, (right - left) * (bottom - top));
    return Math.max(res, 0);
}


DOMRect.prototype.intersects = function intersects({ left, top, right, bottom }) {
    return (this.top <= bottom && this.bottom >= top && this.left <= right && this.right >= left)
}

DOMRect.prototype.contains = function contains({ x, y }) {
    return this.top <= y && this.bottom >= y && this.left <= x && this.right >= x;
}

DOMRect.prototype.resize = function resize(width, height) {
    return new DOMRect(this.x, this.y, width || this.width, height || this.height);
}

DOMRect.prototype.move = function move(x, y) {
    return new DOMRect(this.x + (x || 0), this.y + (y || 0), this.width, this.height);
}

export interface Constructor<T, Args extends any[] = []> extends Function {
    new(...args: Args): T;
    prototype: T;
}

interface SyntaticConstructor<T, Args extends Array<any>, Params extends Array<any>> extends Function {
    new(_super: (...args: Params) => T, ...args: Args): T;
    prototype: T;
}

export function __extendsNative<T extends {}, Args extends Array<any>, R extends {}, M extends Array<any>>(cons: SyntaticConstructor<R, Args, M>, native: Constructor<T, any[]>) {
    let res = function (this: T & typeof cons.prototype, ...args: Args) {
        if (!new.target) throw new Error(`Class constructor ${native} cannot be invoked without 'new'`)
        let _super: typeof native;
        let _superWrapper = function (this: any, ...args: ConstructorParameters<typeof native>) {
            if (_super) throw new Error("A second call to super()");
            let fn = native.bind(this, ...args);
            let instance = new fn();
            Object.setPrototypeOf(instance, res.prototype);
            _super = instance;
            return instance;
        }
        cons.call(undefined, _superWrapper.bind(this), ...args);
        if (!_super) throw new Error("super() was not called!");
        return _super;
    }

    res.prototype = Object.create(native.prototype);
    Object.defineProperty(res.prototype, "constructor", {
        enumerable: false,
        value: res
    });
    Object.assign(res.prototype, cons.prototype);
    Object.setPrototypeOf(res.prototype, native.prototype);
    Object.setPrototypeOf(res, native);
    return res as any as Constructor<R & T, Args>;
}

export function accessField<T>(obj: any, ...field: string[]): T {
    for (let r of field)
        obj = obj && obj[r];
    return obj;
}

export function firstPresentMap<T, R>(arr: T[], map: (val: T, index: number, arr: T[]) => R) {
    for (let i = 0; i < arr.length; i++) {
        let newEl = map(arr[i], i, arr);
        if (newEl) return newEl;
    }
}

export function mapPresent<T, R>(arr: T[], map: (val: T, index: number, arr: T[]) => R): R[] {
    let newArr = new Array(arr.length);
    let newIndex = 0;
    for (let i = 0; i < arr.length; i++) {
        let m = map(arr[i], i, arr);
        if (m) newArr[newIndex++] = m;
    }
    return newArr.slice(0, newIndex);
}

export function fileName(path: string) {
    let nameIndex = path.lastIndexOf("/") + 1;
    let extIndex = path.slice(nameIndex).lastIndexOf(".");
    return path.substr(nameIndex, extIndex === -1 ? undefined : extIndex);
}

export function fileComponents(path: string) {
    let pathComps = path.split("/");
    let fname = pathComps.pop();
    let extIndex = fname.lastIndexOf(".");
    extIndex = extIndex === -1 ? fname.length : extIndex;
    return [...pathComps, fname.slice(0, extIndex), fname.slice(extIndex + 1)];
}

export function glob(path: string[], search: any, dirs: boolean = true): any[] {
    let node: (list: listEntry) => objectEntry[];
    for (let comp of path.reverse())
        node = comp.indexOf("**") !== -1 ? doubleWildcard(node, dirs) : comp.indexOf("*") !== -1 ? wildcard(comp, node, dirs) : filter(comp, node, dirs);
    return node(Object.entries(search));
}

export function walkObjects(fn: (path: string, ...entries: [string, any][]) => void, separator: string, ...objs: [string, any][]) {
    let entries = objs;
    while (entries.length) {
        let tree = [[entries.pop()]];
        let path = "";
        fn(path, tree[0][0])
        while (tree.length) {
            path = tree.map(arr => arr[0][0]).join(separator);
            let entry = tree[tree.length - 1][0];
            if (typeof entry[1] !== "object") {
                tree[tree.length - 1].pop();
                while (tree.length && !tree[tree.length - 1].length) {
                    tree.pop();
                    if (tree.length) tree[tree.length - 1].pop();
                }
            } else {
                let subEntries = Object.entries(entry[1]);
                fn(path, ...subEntries);
                tree.push(subEntries);
            }
        }
    }
}


type objectEntry = [string, objectEntry | any];
type listEntry = objectEntry[];
type retEntry = objectEntry[]

function doubleWildcard(next?: (list: listEntry) => retEntry, dirs?: boolean) {
    return function doubleWildcard__IMPL(list: listEntry): retEntry {
        if (!list) return [];
        let accept = [];
        walkObjects((path, ...entries: [string, any][]) => {
            entries = entries.map(e => {
                let comps = fileComponents(e[0]);
                return (e[0] = [...comps.slice(0, comps.length - 2), path, comps[comps.length - 2]].reduce((s, e) => `${s}${!s ? "" : "/"}${e}`, ""), e);
            });
            accept.push(...next ? next(entries) : !dirs ? entries.filter(e => typeof e[1] === "string") : entries);
        }, "/", ...list)
        return accept;
    }
}

function wildcard(exp: string, next: (list: listEntry) => retEntry, dirs?: boolean) {
    let reg = exp !== "*" ? new RegExp(exp.replace("*", ".*")) : undefined;
    return function wildcard__IMPL(list: listEntry): retEntry {
        if (!list) return [];
        let accept = reg ? list.filter(f => f[0].match(reg)) : list;
        let cAccept = next ? next(accept.flatMap(a => typeof a[1] === "string" ? [] :
            Object.entries(a[1]).map(child => (child[0] = `${a[0]}/${child[0]}`, child))))
            : !dirs ? accept.filter(e => typeof e[1] === "string") : accept;
        return cAccept;
    }
}

function filter(filter: string, next: (list: listEntry) => retEntry, dirs?: boolean) {
    return function filter__IMPL(list: listEntry): retEntry {
        if (!(list instanceof Array)) return [list];
        let accept = list.filter(item => filter === item[0]);
        let cAccept = next ? next(accept.flatMap(a => typeof a[1] === "string" ? [] : Object.entries(a[1]).map(child => (child[0] = `${a[0]}/${child[0]}`, child)))) :
            !dirs ? accept.filter(e => typeof e[1] === "string") : accept;
        return cAccept;
    }
}

type Command = {
    cls?: string;
    collect?: boolean;
    newlineTerminate?: boolean;
} | string

export function mdToHtml(parent: HTMLElement, text: string) {
    if (!parent) parent = document.createElement("div");
    parent.classList.add("htd")
    type Conf = { startIndex: number, scanned?: number, count?: number, children: Node[], combine?: string[], end?: number };
    let state = {
        elementStack: [] as [string, Command, Conf][],
        lastScanned: 0
    }
    let pttr = /[<>\n]/g;
    let match = pttr.exec(text);
    while (match) {
        let handled = false;
        let lastChar: string;
        let parentConf = state.elementStack.length && state.elementStack[state.elementStack.length - 1][2];
        switch (match[0]) {
            case ">":
                lastChar = text[match.index + 1];
                if (!parentConf || (parentConf.scanned || parentConf.startIndex) + 1 < match.index) {
                    if (state.elementStack.length) {
                        parentConf.children.push(new Text(text.slice((parentConf.scanned || parentConf.startIndex || state.lastScanned) + 1, match.index)));
                        parentConf.scanned = match.index;
                    } else {
                        parent.appendChild(new Text(text.slice((state.lastScanned || -1) + 1, match.index)))
                        state.lastScanned = match.index;
                    }
                }
                if (handled = lastChar in commands) {
                    let command = commands[lastChar];
                    let conf: Conf = {
                        children: [],
                        startIndex: match.index + 1
                    };
                    if (typeof command === "object" && command.collect) conf.count = text.match(`\\${text[match.index + 1]}*`).length;
                    state.elementStack.push([lastChar, command, conf]);
                }
                break;
            case "<":
                lastChar = text[match.index - 1];
                if (handled = lastChar in commands) {
                    let command = commands[lastChar];
                    for (let i = 0; i < state.elementStack.length; i++) {
                        let index = state.elementStack.length - 1 - i;
                        if (state.elementStack[index][1] === command) {
                            close(index, match.index);
                            state.elementStack.splice(index, 1);
                            break;
                        }
                    }
                }
                break;
            case "\n":
                handled = true;
                if (text[match.index - 1] !== "\\" && (parentConf && parentConf.scanned !== 0) || text.substring(0, match.index).trim().length) {
                    let lastCut = -1
                    let i = 0;
                    for (; i < state.elementStack.length; i++) {
                        let el = state.elementStack[state.elementStack.length - 1 - i]
                        if (typeof el[1] === "object" && el[1].newlineTerminate) {
                            lastCut = i;
                            break;
                        }
                    }
                    if (lastCut > -1) {
                        close(lastCut, match.index);
                        state.elementStack = state.elementStack.slice(0, lastCut);
                    }
                    let prev = parentConf.scanned || parentConf.startIndex || state.lastScanned;
                    let br = document.createElement("br");
                    let children = [new Text(text.slice((prev || -1) + 1, match.index)), br];
                    if (state.elementStack.length) {
                        state.elementStack[state.elementStack.length - 1][2].children.push(...children);
                        parentConf.scanned = match.index;
                    } else {
                        parent.append(...children);
                        state.lastScanned = match.index;
                    }
                }
        }
        if (!handled) {
            let lastChild = parent.childNodes[parent.childNodes.length - 1];
            if (lastChild instanceof Text)
                lastChild.textContent += match[0];
            else
                parent.appendChild(new Text(match[0]));
        }
        match = pttr.exec(text);
    }
    if (state.lastScanned !== text.length - 2) {
        if (state.elementStack.length) {
            close(0, text.length - 1);
        } else {
            let lastChild = parent.childNodes[parent.childNodes.length - 1];
            let lastText = text.substr((state.lastScanned || -1) + 1);
            if (lastChild instanceof Text)
                lastChild.textContent += lastText;
            else
                parent.appendChild(new Text(lastText));
        }
    }
    function close(index: number, textEnd: number) {
        let stack = state.elementStack;
        let parentFrame = stack[index - 1];
        if (parentFrame && parentFrame[2].startIndex + 2 === state.elementStack[index][2].startIndex && text.substr(textEnd + 1, 2) === `${parentFrame[0]}<`) {
            parentFrame[2].combine = (parentFrame[2].combine || []).concat(...getClasses(state.elementStack[index]));
            parentFrame[2].startIndex = state.elementStack[index][2].startIndex;
            parentFrame[2].end = textEnd;
        } else {
            let elFrame = state.elementStack[index];
            let end = index === state.elementStack.length - 1 ? textEnd : state.elementStack[index + 1][2].startIndex;
            let el = document.createElement("span");
            el.appendChild(new Text(text.slice((elFrame[2].scanned || elFrame[2].startIndex || state.lastScanned) + 1, (stack[index][2].end || end) - 1)));
            el.classList.add(...getClasses(elFrame));
            if (index - 1 >= 0)
                state.elementStack[index - 1][2].children.push(el);
            else
                parent.appendChild(el);
            if (end !== textEnd && index + 1 < stack.length)
                stack.slice(index + 1).reverse().forEach((_, i) => {
                    close(index + 1 + i, textEnd)
                    stack[index + 1 + i][2].scanned = textEnd;
                });
            el.append(...elFrame[2].children);
            if (parentFrame)
                parentFrame[2].scanned = textEnd;
            else
                state.lastScanned = textEnd;
        }
    }
    function getClasses(el: [string, Command, Conf]) {
        return [...(el[2].combine || []), typeof el[1] === "string" ? el[1] : el[1].cls];
    }
    return parent;
}

let commands: {
    [index: string]: Command
} = {
    "*": "bold",
    "!": "emphasis",
    "$": "focus",
    "/": "italics",
    "_": "underscore",
    "#": {
        collect: true,
        newlineTerminate: true,
        cls: "title"
    }
}