// This file acts as a library for the SVG Editor
// It contains support classes for shapes that can be drawn on the canvas

const SVG_NS = "http://www.w3.org/2000/svg";

// Base Shape class
// The base class should have methods common to all shapes
// and define abstract methods for shape-specific behavior
class Shape { 
    
    // Properties common to all shapes
    // #element represents the actual SVG element on the canvas
    #x; #y; #color; #strokeWidth; #element;

    constructor(x, y, color, strokeWidth)
    {
        this.#x = x;
        this.#y = y;
        this.#color = color;
        this.#strokeWidth = strokeWidth;
    }
    
    // Helper to set common attributes
    setCommnonAttributes(el) {
        el.setAttribute("fill", this.#color);
        el.setAttribute("stroke", "black");
        el.setAttribute("stroke-width", this.#strokeWidth);
        this.#element = el;
    }

    get element() { return this.#element; }

    // Abstract method to be implemented by subclasses
    render() {
        throw new Error("Method 'render()' must be implemented.");
    }
}

// Circle shape subclass
export class Circle extends Shape {
    #radius;
    constructor(x, y, radius, color, strokeWidth) {
        super(x, y, color, strokeWidth);
        this.#radius = radius;
    }

    render() { 
        const circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("cx", this.x);
        circle.setAttribute("cy", this.y);
        circle.setAttribute("r", this.#radius);
        this.setCommnonAttributes(circle);
        return circle;

    }
};

// Rectangle shape subclass
export class Rectangle extends Shape { 
    #width; #height;
    constructor(x, y, width, height, color, strokeWidth) {
        super(x, y, color, strokeWidth);
        this.#width = width;
        this.#height = height;
    }

    render() {
        const rect = document.createElementNS(SVG_NS, "rect");
        rect.setAttribute("x", this.x);
        rect.setAttribute("y", this.y);
        rect.setAttribute("width", this.#width);
        rect.setAttribute("height", this.#height);
        this.setCommnonAttributes(rect);
        return rect;
    }

};


// Line shape subclass
export class Line extends Shape { 
    #x2; #y2;
    constructor(x1, y1, x2, y2, color, strokeWidth) {
        super(x1, y1, color, strokeWidth);
        this.#x2 = x2;
        this.#y2 = y2;
    }

    render() { 
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", this.x);
        line.setAttribute("y1", this.y);
        line.setAttribute("x2", this.#x2);
        line.setAttribute("y2", this.#y2);
        this.setCommnonAttributes(line);
        return line;
    }
}; 