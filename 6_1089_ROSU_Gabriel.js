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
     * @property {number} strokeWidth - width of the shape's outline 
     * @property {HTMLElement|null} element - The SVG element associated with the shape (once rendered)
     * @property {boolean} isSelected - Flag indicating if the shape is currently selected
     */

    _x; _y; _color; _strokeWidth; _element; _isSelected;


    constructor(x, y, color = "black", strokeWidth = 1) {
        this._x = x;
        this._y = y;
        this._color = color;
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
        // Position attributes will be set in derived classes
    }
    
    // Getter for the SVGEditor to access the element
    get element() { return this._element; }
    get isSelected() { return this._isSelected; }
}

export class Elipse extends Shape {
    // aRadius, bRadius properties specific to Elipse
    aRadius; bRadius;
    
    constructor(x, y, aRadius, bRadius, color = "black", strokeWidth = 1) {
        // Call the base class constructor
        super(x, y, color, strokeWidth);
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
        super.update(); // Apply common styles
        return this._element;
    }
}

export class Rectangle extends Shape {
    // Width and Height properties specific to Rectangle
    _width; _height;

    constructor(x, y, width, height, color = "black", strokeWidth = 1) {
        // Call the base class constructor
        super(x, y, color, strokeWidth);
        this._width = width;
        this._height = height;
    }

    render() {
        // Create the SVG rect element
        const rect = document.createElementNS(SVG_NS, "rect");
        rect.setAttribute("x", this._x);
        rect.setAttribute("y", this._y);
        rect.setAttribute("width", this._width);
        rect.setAttribute("height", this._height);
        rect.setAttribute("fill", "none"); // No fill by default

        this._element = rect;
        super.update(); // Apply common styles
        return this._element
    }
}

export class Line extends Shape {
    // End coordinates specific to Line
    _x2; _y2;

    constructor(x1, y1, x2, y2, color = "black", strokeWidth = 1) {
        // Call the base class constructor  
        super(x1, y1, color, strokeWidth);
        this._x2 = x2;
        this._y2 = y2;
    }

    render() {
        // Create the SVG line element
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", this._x);
        line.setAttribute("y1", this._y);
        line.setAttribute("x2", this._x2);
        line.setAttribute("y2", this._y2);

        this._element = line;
        super.update(); // Apply common styles
        return this._element;
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
        this.#svgCanvas.appendChild(svgElement);
    }

    moveShape(shape, newX, newY) {
        shape._x = newX;
        shape._y = newY;
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
}

