// This file acts as a library for the SVG Editor
// It contains support classes for shapes that can be drawn on the canvas and the SVGEditor class itself 
// which manages the SVG canvas and the shapes

const SVG_NS = "http://www.w3.org/2000/svg";


// ========================================SHAPE CLASSES======================================== //
// Even though the SVG 

// Base Shape class
class Shape {

    /**
     * Common properties for all shapes
     * 
     * Defined as protected (_propertyName) to allow access in derived classes
     * not using any modifier would make them public, exposing tem to unintended
     * external modification
     * 
     * @property {number} x - x coordinate of the shape
     * @property {number} y - y coordinate of the shape
     * @property {string} color - color of the shape's stroke/outline color (e.g. 'black', '#000000')
     * @property {string} fillColor - color of the shape's inside (e.g. 'black', '#000000')
     * @property {number} strokeWidth - width of the shape's outline 
     * @property {HTMLElement|null} element - The SVG element associated with the shape (once rendered)
     * @property {boolean} isSelected - Flag indicating if the shape is currently selected
     */

    _x; _y; _color; _fillColor; _strokeWidth; _element; _isSelected;


    constructor(x, y, color = "black", fillColor='transparent', strokeWidth = 1) {
        this._x = x;
        this._y = y;
        this._color = color;
        this._fillColor = fillColor;
        this._strokeWidth = strokeWidth;
        this._isSelected = false;
        this._element = null; 
    }

    
    // Abstract render method that must be implemented by derived classes
    render() {
        throw new Error("Render method must be implemented by derived classes");
    }
    
    // Update method to update the DOM element based on current object properties
    update() {
        if (!this._element) return;
        this._element.setAttribute("stroke", this._color);
        this._element.setAttribute("stroke-width", this._strokeWidth);
        this._element.setAttribute("fill", this._fillColor); 
        // Position attributes will be set in derived classes
    }
    
    // Getter for the SVGEditor to access the element
    get element() { return this._element; }
    get isSelected() { return this._isSelected; }

    // Getters and setters for common properties
    get x() { return this._x; }
    set x(value) {this._x = value; this.update(); }
    get y() {return this._y; }
    set y(value) { this._y = value; this.update(); }
    get color() { return this._color; }
    set color(value) { this._color = value; this.update(); }
    get fillColor() { return this._fillColor; }
    set fillColor(value) { this._fillColor = value; this.update(); }
    get strokeWidth() { return this._strokeWidth; }
    set strokeWidth(value) { this._strokeWidth = value; this.update(); }
}

export class Elipse extends Shape {
    // aRadius, bRadius properties specific to Elipse
    aRadius; bRadius;
    
    constructor(x, y, aRadius, bRadius, color = "black", fillColor="transparent", strokeWidth = 1) {
        // Call the base class constructor
        super(x, y, color, fillColor, strokeWidth);
        this.aRadius = aRadius;
        this.bRadius = bRadius;
    }

    render() {
        // Create the SVG ellipse element
        const ellipse = document.createElementNS(SVG_NS, "ellipse");
        ellipse.setAttribute("cx", this._x);
        ellipse.setAttribute("cy", this._y);
        ellipse.setAttribute("rx", this.aRadius);
        ellipse.setAttribute("ry", this.bRadius);
        ellipse.setAttribute("fill", "none"); // No fill by default
        
        this._element = ellipse;
        this.update(); // Apply common styles
        return this._element;
    }

    update() {
        super.update();
        if (this._element) {
            this._element.setAttribute("cx", this._x);
            this._element.setAttribute("cy", this._y);
            this._element.setAttribute("rx", this.aRadius);
            this._element.setAttribute("ry", this.bRadius);
        }
    }

}

export class Rectangle extends Shape {
    // Width and Height properties specific to Rectangle
    _width; _height;

    constructor(x, y, width, height, color = "black", fillColor="transparent",strokeWidth = 1) {
        // Call the base class constructor
        super(x, y, color, fillColor, strokeWidth);
        this._width = width;
        this._height = height;
    }

    render() {
        // Create the SVG rect element
        const rect = document.createElementNS(SVG_NS, "rect");
        this._element = rect;
        this.update();
        return this._element
    }

    update() {
        super.update();
        if (this._element) {
            this._element.setAttribute("x", this._x);
            this._element.setAttribute("y", this._y);
            this._element.setAttribute("width", this._width);
            this._element.setAttribute("height", this._height);
        }
    }
}

export class Line extends Shape {
    // End coordinates specific to Line
    _x2; _y2;

    constructor(x1, y1, x2, y2, color = "black", fillColor = "transparent", strokeWidth = 1) {
        // Call the base class constructor  
        super(x1, y1, color, fillColor, strokeWidth);
        this._x2 = x2;
        this._y2 = y2;
    }

    render() {
        // Create the SVG line element
        const line = document.createElementNS(SVG_NS, "line");
        this._element = line;
        this.update();
        return this._element;
    }

    update() {
        super.update();
        if (this._element) {
            // For lines, we calculate the difference to move the second point too
            const dx = this._x2 - this._oldX || 0;
            const dy = this._y2 - this._oldY || 0;

            this._element.setAttribute("x1", this._x);
            this._element.setAttribute("y1", this._y);
            this._element.setAttribute("x2", this._x2);
            this._element.setAttribute("y2", this._y2);
        }
    }

    // Custom setter for the Line shape to move both points together

    set x(value) {
        const dx = value - this._x;
        this._x = value;
        this._x2 += dx;
        this.update();
    }
    set y(value) {
        const dy = value - this.y;
        this._y = value;
        this._y2 += dy;
        this.update();
    }

}


// SVGEditor class to manage the SVG canvas and shapes
export class SVGEditor {

    /**
     * @property {Shape[]} #shapes - Array to hold all shapes on the canvas
     * @property {HTMLElement} #svgCanvas - The SVG canvas element
     * @property {Shape|null} #selectedShape - Currently selected shape
     */

    #shapes = [];
    #svgCanvas;
    #selectedShape = null;

    constructor(svgCanvasId) {
        this.#svgCanvas = document.getElementById(svgCanvasId);
    }

    /**
    * Method to add a shape on the canvas
    * @param {Shape} shape - The shape object to add
    */

    addShape(shape) {
        this.#shapes.push(shape);
        const svgElement = shape.render();
        svgElement.shapeObject = shape;
        this.#svgCanvas.appendChild(svgElement);
        this.selectShape(shape);
    }

    selectShape(shape) {
        this.deselectShape();
        this.#selectedShape = shape;
        if (shape) {
            shape.element.classList.add('selected');
        }
    }

    deselectShape() {
        if (this.#selectedShape) {
            this.#selectedShape.element.classList.remove("selected");
            this.#selectedShape = null;
        }
    }

    // Public getter so external code (UI) can access the currently selected shape
    getSelectedShape() {
        return this.#selectedShape;
    }

    findShapeByElement(element) {
        return this.#shapes.find(s => s.element === element);
    }

    moveShape(shape, newX, newY) {
        if (shape instanceof Line) {
            const dx = newX - shape._x;
            const dy = newY - shape._y;
            shape._x = newX;
            shape._y = newY;
            shape._x2 += dx;
            shape._y2 += dy;
        } else {
            shape._x = newX;
            shape._y = newY;
        }
        shape.update();
    }

    deleteShape() { 
        if (this.#selectedShape) {
            this.#svgCanvas.removeChild(this.#selectedShape.element);
            this.#shapes = this.#shapes.filter(s => s !== this.#selectedShape);
            this.#selectedShape = null;
        } else {
            console.log("No shape is currently selected for deletion.");
        }
    }

    get svgCanvas() { return this.#svgCanvas; }
}

