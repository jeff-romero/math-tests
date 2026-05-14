
class Equation {
    constructor(numerator, denominator, operator, playerAnswer=null) {
        this.__numerator = numerator;
        this.__denominator = denominator;
        this.__operator = operator;
        this.__answer = 0;
        this.__playerAnswer = playerAnswer;

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

    get playerAnswer() {
        return this.__playerAnswer;
    }

    set playerAnswer(element=null) {
        this.__playerAnswer = element;
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
    static MULT = "×";
    static DIV = "/";

    constructor(rows=Exam.MAX_ROWS, cols=Exam.MAX_COLS, min=Exam.MIN_OPERAND, max=Exam.MAX_OPERAND) {
        this.__rows = rows;
        this.__cols = cols;
        this.__min = min;
        this.__max = max;
        this.__playerAnswers = [];
        this.__equations = [];
        this.__operators = [];
        this.__operators.push(Exam.MULT);

        this.__showErrors = document.getElementById("showErrors");
        this.__showErrors.addEventListener("change", () => {
            if (this.__equations.length == 0) {
                return;
            }
            for (let r = 0; r < this.__rows; r++) {
                for (let c = 0; c < this.__cols; c++) {
                    let currentEq = this.__equations[r][c];
                    if (!currentEq || !currentEq.playerAnswer) {
                        continue;
                    }

                    if (this.__showErrors.checked) {
                        console.log(`current answer: ${currentEq.playerAnswer.value}`);
                        if (currentEq.playerAnswer.value.length > 0 && currentEq.answer != currentEq.playerAnswer.value) {
                            currentEq.playerAnswer.style.backgroundColor = "red";
                        }
                    }
                    else {
                        currentEq.playerAnswer.style.backgroundColor = "white";
                    }
                }
            }
        });

        // initialize equations
        for (let r = 0; r < Exam.MAX_ROWS; r++) {
            let row = [];

            for (let c = 0; c < Exam.MAX_COLS; c++) {
                let equation = this.createEquation();
                row.push(equation);
            }

            this.__equations.push(row);
        }

        // initialize player answers
        for (let r = 0; r < this.__rows; r++) {
            let paRow = [];

            for (let c = 0; c < this.__cols; c++) {
                paRow.push(0);
            }

            this.__playerAnswers.push(paRow);
        }
    }

    createEquation() {
        let numerator = Math.floor((Math.random() * this.__max) + this.__min);
        let denominator = Math.floor((Math.random() * this.__max) + this.__min);
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

            for (let c = 0; c < this.__equations[i].length; c++) {
                let equation = document.createElement("div");
                equation.className = "equation";

                let numerator = document.createElement("span");
                let denominatorWrapper = document.createElement("div");
                denominatorWrapper.className = "denominatorWrapper";
                let denominator = document.createElement("span");
                let operator = document.createElement("span");
                let hr = document.createElement("hr");
                let playerAnswer = document.createElement("input");
                playerAnswer.className = "playerAnswer";

                let currentEq = this.__equations[i][c];
                currentEq.playerAnswer = playerAnswer;
                playerAnswer.addEventListener("change", (e) => {
                    if (this.__showErrors.checked) {
                        if (e.target.value != currentEq.answer) {
                            e.target.style.backgroundColor = "red";
                        }
                        else if (e.target.style.backgroundColor != "white") {
                            e.target.style.backgroundColor = "white";
                        }
                        // currentEq.playerAnswer.value = e.target.value;
                    }
                });

                numerator.innerText = currentEq.numerator;
                operator.innerText = currentEq.operator;
                denominator.innerText = currentEq.denominator;

                denominatorWrapper.appendChild(operator);
                denominatorWrapper.appendChild(denominator);

                equation.appendChild(numerator);
                equation.appendChild(denominatorWrapper);
                equation.appendChild(hr);
                equation.appendChild(playerAnswer);

                row.appendChild(equation);
            }

            root.appendChild(row);
        }
    }
}

let exam = new Exam();
exam.draw();
