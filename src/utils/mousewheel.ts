import clamp from "./clamp";

// https://stackoverflow.com/questions/37019995/how-to-detect-scroll-event-and-direction-in-a-not-scrollable-element-using-javas
// https://developer.mozilla.org/en-US/docs/Web/Events/mousewheel

// All code in this file is super non standard and different on every browser/OS combination.

const HANDLER_KEY = "__mousewheel_handler__";

type Callback = (scroll: number) => void;

export const addEventHandler = (element: HTMLElement, callback: Callback, options: any = false) => {
    const handler = (e: any) => {
        e = window.event || e;
        const delta = clamp(-1, 1, e.wheelData || -e.detail || e.deltaY);
        e.preventDefault();
        callback(delta);
        return false;
    }
    (callback as any)[HANDLER_KEY] = handler;
    element.addEventListener("mousewheel", handler, options);
    element.addEventListener("DOMMouseScroll", handler, options);
}

export const removeEventHandler = (element: HTMLElement, callback: Callback, options: any = false) => {
    const handler = (callback as any)[HANDLER_KEY];
    if (handler) {
        element.removeEventListener("mousewheel", handler, options);
        element.removeEventListener("DOMMouseScroll", handler, options);
    }
}
