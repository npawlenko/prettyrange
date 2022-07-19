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
        // Steps
        const stepsData = this.element.dataset.steps;
        if(stepsData !== undefined) {
            const steps = JSON.parse(stepsData);
            if(steps === null) throw new Error("Could not parse given steps JSON");
            if(!Array.isArray(steps)) throw new Error("Given steps should be an array");
            if(steps.length < 2) throw new Error("Please provide at least 2 steps");

            this.steps = steps;
        }
        this.stepBlocking = this.element.dataset.stepBlocking === "true";

        // if steps disabled
        if(this.steps === undefined) {
            // check other parameters
            if(this.min === undefined || this.max === undefined) throw new Error("Please specify min and max values");
            if(this.min === this.max) throw new Error("Min and max values should be different");
            if(this.min > this.max) throw new Error("Min value should be greater than max");
        }

        // Class
        this.track = this.element.querySelector(".prettyrange-track");
        this.activeTrack = this.element.querySelector(".prettyrange-active-track");
        this.thumb = this.element.querySelector(".prettyrange-thumb");
        this.hiddenInput = this.element.querySelector("input[type=hidden]");

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

        const value = this.translatePosition(position);

        if(Array.isArray(this.steps)) {
            // steps enabled
            const steps = this.steps;
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

            // Update value
            this.value = closestStep;
        }
        else {
            // Move thumb and update active track
            const val = `${position}px`;
            this.thumb.style.left = val;
            this.activeTrack.style.width = val;

            // Update value
            this.value = this.translatePosition(position);
        }
    }

    /**
     * Translates position into input value
     * @param position
     * @return number
     */
    translatePosition(position: number) {
        let value: number;

        const width = this.track.offsetWidth;
        const percentage = position / width;
        value = Math.ceil(this.max * percentage);

        return value;
    }

    /**
     * Translates step into thumb position
     * @param step
     * @return number
     */
    translateStep(step: number) {
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