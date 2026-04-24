
class Equation {
    constructor(numerator, denominator, operator) {
        this.__numerator = numerator;
        this.__denominator = denominator;
        this.__operator = operator;
        this.__answer = 0;
    }

    get numerator() {
        return this.__numerator;
    }

    get denominator() {
        return this.__denominator;
    }

    get operator() {
        return this.__operator;
    }

    get answer() {
        return this.__answer;
    }
}

class Exam {
    static MAX_ROWS = 10;
    static MAX_COLS = 10;

    constructor() {
        let root = [];

        for (let r = 0; r < MAX_ROWS; r++) {
            let row = [];

            for (let c = 0; c < MAX_COLS; c++) {
                let equation = createEquation();
                row.push(equation);
            }

            root.push(row);
        }
    }

    createRow() {
        let row = document.createElement("div");
        row.className = "row";
        return row;
    }

    createEquation() {
        return new Equation();
    }
}
