// TODO: steps
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
    PrettyRange.prototype.onMove = function (event) {
        var _this = this;
        var onMove = function (e) {
            var position = _this.relativePosition(e.x);
            _this.apply(position);
        };
        var endMove = function () {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', endMove);
        };
        // clicked
        var target = event.target;
        event.target.addEventListener('mousedown', function (e) {
            if (target.classList.contains('prettyrange-track')) {
                _this.apply(e.x);
            }
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', endMove);
        });
    };
    /* Functions */
    /**
     * Updates input track and moves thumb to given position
     * @param position
     * @return void
     */
    PrettyRange.prototype.apply = function (position) {
        // invalid position
        if (position <= 0 || position >= this.track.offsetWidth)
            return;
        this.value = this.translatePosition(position);
        // Move thumb and update active track
        var val = "".concat(position, "px");
        this.thumb.style.left = val;
        this.activeTrack.style.width = val;
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
        value = Math.round(this.max * percentage);
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
