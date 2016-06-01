import {Spatial} from "../../Geo";

export class DirectionDOMCalculator {
    private _spatial: Spatial;

    private _elementWidth: number;
    private _elementHeight: number;

    private _minWidth: number;
    private _maxWidth: number;

    private _minThresholdWidth: number;
    private _maxThresholdWidth: number;
    private _minThresholdHeight: number;
    private _maxThresholdHeight: number;

    private _containerWidth: number;
    private _containerWidthCss: string;
    private _containerMarginCss: string;
    private _containerLeftCss: string;
    private _containerHeight: number;
    private _containerHeightCss: string;

    private _stepCircleSize: number;
    private _stepCircleSizeCss: string;
    private _stepCircleMarginCss: string;

    private _turnCircleSize: number;
    private _turnCircleSizeCss: string;

    private _outerRadius: number;
    private _innerRadius: number;

    private _shadowOffset: number;

    constructor(element: HTMLElement) {
        this._spatial = new Spatial();

        this._minWidth = 260;
        this._maxWidth = 460;
        this._minThresholdWidth = 320;
        this._maxThresholdWidth = 1480;
        this._minThresholdHeight = 240;
        this._maxThresholdHeight = 820;

        this.resize(element);
    }

    public get containerWidth(): number {
        return this._containerWidth;
    }

    public get containerWidthCss(): string {
        return this._containerWidthCss;
    }

    public get containerMarginCss(): string {
        return this._containerMarginCss;
    }

    public get containerLeftCss(): string {
        return this._containerLeftCss;
    }

    public get containerHeight(): number {
        return this._containerHeight;
    }

    public get containerHeightCss(): string {
        return this._containerHeightCss;
    }

    public get stepCircleSize(): number {
        return this._stepCircleSize;
    }

    public get stepCircleSizeCss(): string {
        return this._stepCircleSizeCss;
    }

    public get stepCircleMarginCss(): string {
        return this._stepCircleMarginCss;
    }

    public get turnCircleSize(): number {
        return this._turnCircleSize;
    }

    public get turnCircleSizeCss(): string {
        return this._turnCircleSizeCss;
    }

    public get outerRadius(): number {
        return this._outerRadius;
    }

    public get innerRadius(): number {
        return this._innerRadius;
    }

    public get shadowOffset(): number {
        return this._shadowOffset;
    }

    /**
     * Resizes all properties according to the width and height
     * of the element.
     *
     * @param {HTMLElement} element The container element from which to extract
     * the width and height.
     */
    public resize(element: HTMLElement): void {
        this._elementWidth = element.offsetWidth;
        this._elementHeight = element.offsetHeight;

        this._containerWidth = this._getContainerWidth(element.offsetWidth, element.offsetHeight);
        this._containerHeight = this._getContainerHeight(this.containerWidth);
        this._stepCircleSize = this._getStepCircleDiameter(this._containerHeight);
        this._turnCircleSize = this._getTurnCircleDiameter(this.containerHeight);
        this._outerRadius = this._getOuterRadius(this._containerHeight);
        this._innerRadius = this._getInnerRadius(this._containerHeight);

        this._shadowOffset = 3;

        this._containerWidthCss = this._numberToCssPixels(this._containerWidth);
        this._containerMarginCss = this._numberToCssPixels(-0.5 * this._containerWidth);
        this._containerLeftCss = this._numberToCssPixels(Math.floor(0.5 * this._elementWidth));
        this._containerHeightCss = this._numberToCssPixels(this._containerHeight);
        this._stepCircleSizeCss = this._numberToCssPixels(this._stepCircleSize);
        this._stepCircleMarginCss = this._numberToCssPixels(-0.5 * this._stepCircleSize);
        this._turnCircleSizeCss = this._numberToCssPixels(this._turnCircleSize);
    }

    /**
     * Calculates the coordinates on the unit circle for an angle.
     *
     * @param {number} angle Angle in radians.
     * @returns {Array<number>} The x and y coordinates on the unit circle.
     */
    public angleToCoordinates(angle: number): Array<number> {
        return [Math.cos(angle), Math.sin(angle)];
    }

    /**
     * Calculates the coordinates on the unit circle for the
     * relative angle between the first and second angle.
     *
     * @param {number} first Angle in radians.
     * @param {number} second Angle in radians.
     * @returns {Array<number>} The x and y coordinates on the unit circle
     * for the relative angle between the first and second angle.
     */
    public relativeAngleToCoordiantes(first: number, second: number): Array<number> {
        let relativeAngle: number = this._spatial.wrapAngle(first - second);

        return this.angleToCoordinates(relativeAngle);
    }

    private _getContainerWidth(elementWidth: number, elementHeight: number): number {
        let relativeWidth: number =
            (elementWidth - this._minThresholdWidth) / (this._maxThresholdWidth - this._minThresholdWidth);
        let relativeHeight: number =
            (elementHeight - this._minThresholdHeight) / (this._maxThresholdHeight - this._minThresholdHeight);

        let coeff: number = Math.max(0, Math.min(1, Math.min(relativeWidth, relativeHeight)));

        coeff = 0.04 * Math.round(25 * coeff);

        return this._minWidth + coeff * (this._maxWidth - this._minWidth);
    }

    private _getContainerHeight(containerWidth: number): number {
        return 0.77 * containerWidth;
    }

    private _getStepCircleDiameter(containerHeight: number): number {
        return 0.34 * containerHeight;
    }

    private _getTurnCircleDiameter(containerHeight: number): number {
        return 0.3 * containerHeight;
    }

    private _getOuterRadius(containerHeight: number): number {
        return 0.31 * containerHeight;
    }

    private _getInnerRadius(containerHeight: number): number {
        return 0.125 * containerHeight;
    }

    private _numberToCssPixels(value: number): string {
        return value + "px";
    }
}

export default DirectionDOMCalculator;
