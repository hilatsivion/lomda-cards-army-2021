
/**
 * 
 * @param {HTMLElement & { resizeToken?: number }} el 
 * @param {boolean} shrink 
 * @param {"width" | "height" | "width&height"} dim 
 * @param {{ x?: number | string, y?: number | string }} max 
 * @returns {Promise<void>}
 */
function animateDims(el, shrink, dim, max = {}) {
    if (el.resizeToken) clearTimeout(el.resizeToken);
    let resizeListener = (_e, width, height) => {
        if (dim.indexOf("height") !== -1)
            el.style.maxHeight = `${height !== undefined ? height : `${el.scrollHeight}px`}`;
        if (dim.indexOf("width") !== -1)
            el.style.maxWidth = `${width !== undefined ? width : `${el.scrollWidth}px`}`;

    }
    resizeListener(undefined, max.x, max.y);
    window.addEventListener("resize", resizeListener, false);
    if (shrink) {
        void el.offsetWidth;
        resizeListener(undefined, "", "");
        el.style.overflow = "";
    }
    let time = timeToTransition(el, dim.split("&").map(s => `max-${s}`)).reduce((n1, n2) => Math.max(n1, n2 || 0), 0);
    return new Promise(cb => {
        el.resizeToken = setTimeout(() => {
            window.removeEventListener("resize", resizeListener, false);
            el.resizeToken = undefined;
            if (!shrink) {
                resizeListener(undefined, max.x || "unset", max.y || "unset");
                el.style.overflow = "auto";
            }
            cb();
        }, time);
    });
}