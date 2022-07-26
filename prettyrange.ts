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
    steps: Array<number>;
    stepBlocking: boolean;


    constructor(element: HTMLElement) {
        this.element = element;

        this.init = this.init.bind(this);
        this.relativePosition = this.relativePosition.bind(this);
        this.translatePosition = this.translatePosition.bind(this);
        this.translateStep = this.translateStep.bind(this);
        this.apply = this.apply.bind(this);
        this.onMove = this.onMove.bind(this);

        this.init();
    }

    init() {
        const stepsData = this.element.dataset.steps;
        if(stepsData !== undefined) {
            const steps = JSON.parse(stepsData);
            if(steps === null) throw new Error("Could not parse given steps JSON");
            if(!Array.isArray(steps)) throw new Error("Given steps should be an array");
            if(steps.length < 2) throw new Error("Please provide at least 2 steps");

            this.steps = steps;
        }
        this.stepBlocking = this.element.dataset.stepBlocking === "true";

        if(this.steps === undefined) {
            if(this.min === undefined || this.max === undefined) throw new Error("Please specify min and max values");
            if(this.min === this.max) throw new Error("Min and max values should be different");
            if(this.min > this.max) throw new Error("Min value should be greater than max");
        }

        this.track = this.element.querySelector(".prettyrange-track");
        this.activeTrack = this.element.querySelector(".prettyrange-active-track");
        this.thumb = this.element.querySelector(".prettyrange-thumb");
        this.hiddenInput = this.element.querySelector("input[type=hidden]");

        this.track.addEventListener('mousedown', this.onMove);
        this.thumb.addEventListener('mousedown', this.onMove);
        this.track.addEventListener('touchstart', this.onMove);
        this.thumb.addEventListener('touchstart', this.onMove);

        // Apply default value
        this.apply(0);
    }


    /* Events */

    onMove(event: MouseEvent|TouchEvent) {
        const target = <Element> event.target;

        const onMove = (e: MouseEvent|TouchEvent) => {
            const position =  this.relativePosition(PrettyRange.getX(e));
            this.apply(position);
        }

        const endMove = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('touchmove', onMove)
            window.removeEventListener('mouseup', endMove);
            window.removeEventListener('touchend', onMove)
        }

        const start = (e: MouseEvent|TouchEvent) => {
            if(target.classList.contains('prettyrange-track')) {
                const position =  this.relativePosition(PrettyRange.getX(e));
                this.apply(position);
            }

            window.addEventListener('mousemove', onMove);
            window.addEventListener('touchmove', onMove);
            window.addEventListener('mouseup', endMove)
            window.addEventListener('touchend', endMove)
        };



        target.addEventListener('mousedown', start);
        target.addEventListener('touchstart', start);
    }


    /* Functions */

    /**
     * Updates input track and moves thumb to given position
     * @param position
     * @return void
     */
    private apply(position: number) {
        // invalid position
        if(position < 0 || position > this.track.offsetWidth) return;
        if(position == 0) position = 1;


        if(Array.isArray(this.steps)) {
            const value = this.translatePosition(position);

            let steps = this.steps;
            steps.sort((a, b) => {
                return Math.abs(value - a) - Math.abs(value - b);
            });
            const closestStep = steps[0];



            let val: string;
            if(!this.stepBlocking) val = `${position}px`;
            else val = `${this.translateStep(closestStep)}px`;

            // Move thumb and update active track
            this.thumb.style.left = val;
            this.activeTrack.style.width = val;

            this.value = closestStep;
        }
        else {
            // Move thumb and update active track
            const val = `${position}px`;
            this.thumb.style.left = val;
            this.activeTrack.style.width = val;

            this.value = this.translatePosition(position);
        }

        const event = new Event('change');
        this.hiddenInput.dispatchEvent(event);
    }

    static getX(e: MouseEvent|TouchEvent) {
        let x;
        if(e instanceof MouseEvent) {
            x = e.pageX;
        } else if(e instanceof TouchEvent) {
            x = e.touches[0].pageX;
        } else {
            throw new Error("Invalid event passed");
        }

        return x;
    }

    /**
     * Translates position into input value
     * @param position
     * @return number
     */
    private translatePosition(position: number) {
        let value: number;

        const width = this.track.offsetWidth;
        let percentage = position / width;

        if(!isNaN(this.max)) value = Math.ceil(this.max * percentage); // standard
        else {
            const max = Math.max.apply(null, this.steps);
            value = Math.ceil(max * percentage);
        }

        return value;
    }

    /**
     * Translates step into thumb position
     * @param step
     * @return number
     */
    private translateStep(step: number) {
        let value: number;

        const width = this.track.offsetWidth;
        const percentage = step / Math.max.apply(null, this.steps);
        value = width * percentage;

        return value;
    }

    /**
     * Returns position relative to the track
     * @param position
     * @return number
     */
    private relativePosition(position: number) {
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