
class Equation {
    constructor(numerator, denominator, operator) {
        this.__numerator = numerator;
        this.__denominator = denominator;
        this.__operator = operator;
        this.__answer = 0;

        this.calc();
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

    calc() {
        switch (this.__operator) {
            case Exam.ADD:
                this.__answer = this.__numerator + this.__denominator;
                break;
            case Exam.SUB:
                this.__answer = this.__numerator - this.__denominator;
                break;
            case Exam.MULT:
                this.__answer = this.__numerator * this.__denominator;
                break;
            case Exam.DIV:
                this.__answer = this.__numerator / this.__denominator;
                if (this.__answer == Math.floor(this.__answer)) {
                    this.__answer = parseInt(this.__answer);
                }
                break;
            default:
                console.log(`Equation - ERROR: Unknown operator (${this.__operator})!`);
        }
    }
}


class Exam {
    static MAX_ROWS = 10;
    static MAX_COLS = 10;
    static MIN_OPERAND = 1;
    static MAX_OPERAND = 12;
    static ADD = "+";
    static SUB = "-";
    static MULT = "*";
    static DIV = "/";

    constructor(min=Exam.MIN_OPERAND, max=Exam.MAX_OPERAND) {
        this.__equations = [];
        this.__operators = [];
        this.__operators.push(Exam.MULT);

        for (let r = 0; r < Exam.MAX_ROWS; r++) {
            let row = [];

            for (let c = 0; c < Exam.MAX_COLS; c++) {
                let equation = this.createEquation();
                row.push(equation);
            }

            this.__equations.push(row);
        }
    }

    createEquation() {
        let numerator = Math.floor((Math.random() * Exam.MAX_OPERAND) + Exam.MIN_OPERAND);
        let denominator = Math.floor((Math.random() * Exam.MAX_OPERAND) + Exam.MIN_OPERAND);
        let operator = this.__operators[0];

        if (this.__operators.length > 1) {
            operator = this.__operators[Math.floor(Math.random() * this.__operators.length)];
        }

        return new Equation(numerator, denominator, operator);
    }

    draw() {
        let root = document.getElementById("root");

        for (let i = 0; i < this.__equations.length; i++) {
            let row = document.createElement("div");
            row.className = "row";

            

            root.appendChild(row);
        }
    }
}

let exam = new Exam();
