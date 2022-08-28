/**
 * PrettyRange
 * @link https://github.com/npawlenko/prettyrange
 *
 * @author https://github.com/npawlenko/
 * @license MIT
 * @copyright Copyright 2022 npawlenko
 */
var PrettyRange = /** @class */ (function () {
    function PrettyRange(element) {
        this.element = element;
        this.init = this.init.bind(this);
        this.relativePosition = this.relativePosition.bind(this);
        this.translatePosition = this.translatePosition.bind(this);
        this.translateStep = this.translateStep.bind(this);
        this.apply = this.apply.bind(this);
        this.onMove = this.onMove.bind(this);
        this.init();
    }
    PrettyRange.prototype.init = function () {
        // Steps
        var stepsData = this.element.dataset.steps;
        if (stepsData !== undefined) {
            var steps = JSON.parse(stepsData);
            if (steps === null)
                throw new Error("Could not parse given steps JSON");
            if (!Array.isArray(steps))
                throw new Error("Given steps should be an array");
            if (steps.length < 2)
                throw new Error("Please provide at least 2 steps");
            this.steps = steps;
        }
        this.stepBlocking = this.element.dataset.stepBlocking === "true";
        // if steps disabled
        if (this.steps === undefined) {
            // check other parameters
            if (this.min === undefined || this.max === undefined)
                throw new Error("Please specify min and max values");
            if (this.min === this.max)
                throw new Error("Min and max values should be different");
            if (this.min > this.max)
                throw new Error("Min value should be greater than max");
        }
        // Class
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
    };
    /* Events */
    PrettyRange.prototype.onMove = function (event) {
        var _this = this;
        console.log(event);
        var target = event.target;
        var onMove = function (e) {
            var position = _this.relativePosition(PrettyRange.getX(e));
            _this.apply(position);
        };
        var endMove = function () {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mouseup', endMove);
            window.removeEventListener('touchend', onMove);
        };
        var start = function (e) {
            console.log(e, PrettyRange.getX(e));
            if (target.classList.contains('prettyrange-track')) {
                var position = _this.relativePosition(PrettyRange.getX(e));
                _this.apply(position);
            }
            window.addEventListener('mousemove', onMove);
            window.addEventListener('touchmove', onMove);
            window.addEventListener('mouseup', endMove);
            window.addEventListener('touchend', endMove);
        };
        target.addEventListener('mousedown', start);
        target.addEventListener('touchstart', start);
    };
    /* Functions */
    /**
     * Updates input track and moves thumb to given position
     * @param position
     * @return void
     */
    PrettyRange.prototype.apply = function (position) {
        // invalid position
        if (position < 0 || position > this.track.offsetWidth)
            return;
        if (position == 0)
            position = 1;
        if (Array.isArray(this.steps)) {
            var value_1 = this.translatePosition(position);
            // steps enabled
            var steps = this.steps;
            steps.sort(function (a, b) {
                return Math.abs(value_1 - a) - Math.abs(value_1 - b);
            });
            var closestStep = steps[0];
            var val = void 0;
            if (!this.stepBlocking)
                val = "".concat(position, "px");
            else
                val = "".concat(this.translateStep(closestStep), "px");
            // Move thumb and update active track
            this.thumb.style.left = val;
            this.activeTrack.style.width = val;
            // Update value
            this.value = closestStep;
        }
        else {
            // Move thumb and update active track
            var val = "".concat(position, "px");
            this.thumb.style.left = val;
            this.activeTrack.style.width = val;
            // Update value
            this.value = this.translatePosition(position);
        }
        var event = new Event('change');
        this.hiddenInput.dispatchEvent(event);
    };
    PrettyRange.getX = function (e) {
        var x;
        if (e instanceof MouseEvent) {
            x = e.pageX;
        }
        else if (e instanceof TouchEvent) {
            x = e.touches[0].pageX;
        }
        else {
            throw new Error("Invalid event passed");
        }
        return x;
    };
    /**
     * Translates position into input value
     * @param position
     * @return number
     */
    PrettyRange.prototype.translatePosition = function (position) {
        var value;
        var width = this.track.offsetWidth;
        var percentage = position / width;
        if (!isNaN(this.max))
            value = Math.ceil(this.max * percentage); // standard
        else { // steps
            var max = Math.max.apply(null, this.steps);
            value = Math.ceil(max * percentage);
        }
        return value;
    };
    /**
     * Translates step into thumb position
     * @param step
     * @return number
     */
    PrettyRange.prototype.translateStep = function (step) {
        var value;
        var width = this.track.offsetWidth;
        var percentage = step / Math.max.apply(null, this.steps);
        value = width * percentage;
        return value;
    };
    /**
     * Returns position relative to the track
     * @param position
     * @return number
     */
    PrettyRange.prototype.relativePosition = function (position) {
        var rect = this.track.getBoundingClientRect();
        return position - rect.left;
    };
    Object.defineProperty(PrettyRange.prototype, "min", {
        get: function () {
            return Number(this.element.dataset.min);
        },
        /* Getters and setters */
        set: function (min) {
            this.element.dataset.min = min;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PrettyRange.prototype, "max", {
        get: function () {
            return Number(this.element.dataset.max);
        },
        set: function (max) {
            this.element.dataset.max = max;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PrettyRange.prototype, "value", {
        get: function () {
            return Number(this.element.dataset.val);
        },
        set: function (val) {
            this.element.dataset.val = val;
            this.hiddenInput.value = val;
        },
        enumerable: false,
        configurable: true
    });
    return PrettyRange;
}());
//# sourceMappingURL=prettyrange.js.map