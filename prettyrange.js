var PrettyRange = /** @class */ (function () {
    function PrettyRange(element) {
        this.element = element;
        this.track = element.querySelector(".prettyrange-track");
        this.thumb = element.querySelector(".prettyrange-thumb");
        this.hiddenInput = element.querySelector("input[type=hidden]");
    }
    Object.defineProperty(PrettyRange.prototype, "min", {
        get: function () {
            return Number(this.element.dataset.min);
        },
        /* */
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
