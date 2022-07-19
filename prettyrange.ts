// TODO: steps

/**
 * PrettyRange
 * @link https://github.com/npawlenko/prettyrange
 *
 * @author https://github.com/npawlenko/
 * @license MIT
 * @copyright Copyright 2022 npawlenko
 */
class PrettyRange {
    element: HTMLElement;
    track: HTMLElement;
    activeTrack: HTMLElement;
    thumb: HTMLElement;
    hiddenInput: HTMLInputElement;

    constructor(element: HTMLElement) {
        this.element = element;

        this.track = element.querySelector(".prettyrange-track");
        this.activeTrack = element.querySelector(".prettyrange-active-track");
        this.thumb = element.querySelector(".prettyrange-thumb");
        this.hiddenInput = element.querySelector("input[type=hidden]");

        this.relativePosition = this.relativePosition.bind(this);
        this.translatePosition = this.translatePosition.bind(this);
        this.apply = this.apply.bind(this);
        this.onMove = this.onMove.bind(this);

        this.track.addEventListener('mousedown', this.onMove);
        this.thumb.addEventListener('mousedown', this.onMove);
    }


    /* Events */

    onMove(event: MouseEvent) {
        const onMove = (e: MouseEvent) => {
            const position =  this.relativePosition(e.x);
            this.apply(position);
        }

        const endMove = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', endMove);
        }

        // clicked
        const target = <Element> event.target;

        event.target.addEventListener('mousedown', (e: MouseEvent) => {
            if(target.classList.contains('prettyrange-track')) {
                this.apply(e.x);
            }

            window.addEventListener('mousemove', onMove)
            window.addEventListener('mouseup', endMove)
        })
    }


    /* Functions */

    /**
     * Updates input track and moves thumb to given position
     * @param position
     * @return void
     */
    apply(position: number) {
        // invalid position
        if(position <= 0 || position >= this.track.offsetWidth) return;


        this.value = this.translatePosition(position);

        // Move thumb and update active track
        const val = `${position}px`;
        this.thumb.style.left = val;
        this.activeTrack.style.width = val;
    }

    /**
     * Translates position into input value
     * @param position
     * @return number
     */
    translatePosition(position: number) {
        let value: number;

        const width = this.track.offsetWidth;
        const percentage = position/width;
        value = Math.round(this.max * percentage);

        return value;
    }

    /**
     * Returns position relative to the track
     * @param position
     * @return number
     */
    relativePosition(position: number) {
        const rect = this.track.getBoundingClientRect();
        return position - rect.left;
    }


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