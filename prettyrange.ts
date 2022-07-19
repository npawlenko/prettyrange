class PrettyRange {
    element: HTMLElement;
    track: HTMLElement;
    thumb: HTMLElement;
    hiddenInput: HTMLInputElement;

    constructor(element: HTMLElement) {
        this.element = element;

        this.track = element.querySelector(".prettyrange-track");
        this.thumb = element.querySelector(".prettyrange-thumb");
        this.hiddenInput = element.querySelector("input[type=hidden]");
    }


    /* */


    /* Getters and setters */
    set min(min: number) {
        this.element.dataset.min = min as unknown as string;
    }

    get min() {
        return Number(this.element.dataset.min);
    }

    set max(max: number) {
        this.element.dataset.max = max as unknown as string;
    }

    get max() {
        return Number(this.element.dataset.max);
    }

    set value(val: number) {
        this.element.dataset.val = val as unknown as string;
        this.hiddenInput.value = val as unknown as string;
    }

    get value() {
        return Number(this.element.dataset.val);
    }
}