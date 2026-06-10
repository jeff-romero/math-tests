
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
        this.__showErrors = null;

        this.updateTotalEquationCount();

        this.createShowErrorHandler();

        this.initializeEquations();

        this.initializePlayerAnswers();

        this.draw();
    }

    get equations() {
        return this.__equations;
    }

    updateTotalEquationCount() {
        document.getElementById("total").innerText = this.__rows * this.__cols;
    }

    createShowErrorHandler() {
        this.__showErrors = document.getElementById("showErrors");

        this.__showErrors.addEventListener("change", () => {
            if (this.__equations.length == 0 || document.getElementById("score").innerText.length > 0) {
                return;
            }

            for (let r = 0; r < this.__rows; r++) {
                for (let c = 0; c < this.__cols; c++) {
                    let currentEq = this.__equations[r][c];
                    if (!currentEq || !currentEq.playerAnswer) {
                        continue;
                    }

                    if (this.__showErrors.checked) {
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
    }

    initializeEquations() {
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
        let numerator = Math.floor((Math.random() * this.__max) + this.__min);
        let denominator = Math.floor((Math.random() * this.__max) + this.__min);
        let operator = this.__operators[0];

        if (this.__operators.length > 1) {
            operator = this.__operators[Math.floor(Math.random() * this.__operators.length)];
        }

        return new Equation(numerator, denominator, operator);
    }

    initializePlayerAnswers() {
        for (let r = 0; r < this.__rows; r++) {
            let paRow = [];

            for (let c = 0; c < this.__cols; c++) {
                paRow.push(0);
            }

            this.__playerAnswers.push(paRow);
        }
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

                // const re = new RegExp("^-?[0-9]*.?[0-9]*$");
                const re = /^(?![A-Za-z]|\s)+(-?[0-9]*)(.[0-9]*)?$/;

                playerAnswer.addEventListener("input", (e) => {
                    // TODO: add support for negative numbers
                    // if (e.target.value.at(0) == "-" && e.target.value.length == 1) {
                    // }
                    console.log(re.exec(e.target.value));
                    if (re.exec(e.target.value) == null) {
                        e.target.value = e.target.value.slice(0, -1);
                    }
                    // if (isNaN(e.target.value) || e.target.value.at(-1) == " ") {
                    //     e.target.value = e.target.value.slice(0, -1);
                    // }
                });

                playerAnswer.addEventListener("change", (e) => {
                    if (this.__showErrors.checked) {
                        if (e.target.value.length > 0 && e.target.value != currentEq.answer) {
                            e.target.style.backgroundColor = "red";
                        }
                        else if (e.target.style.backgroundColor != "white") {
                            e.target.style.backgroundColor = "white";
                        }
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


class Submit {
    static ID = "submit";
    static DEF_CL = "rgb(170, 170, 170)";
    static HOVER_CL = "rgb(150, 150, 150)";
    static CLICK_CL = "rgb(130, 130, 130)";

    constructor(id=Submit.ID, equations=null) {
        this.__submitted = false;
        this.__button = document.getElementById("submit");

        this.__button.addEventListener("mouseover", (e) => {
            e.target.style.backgroundColor = Submit.HOVER_CL;
        });

        this.__button.addEventListener("mouseleave", (e) => {
            e.target.style.backgroundColor = Submit.DEF_CL;
        });

        this.__button.addEventListener("mousedown", (e) => {
            e.target.style.backgroundColor = Submit.CLICK_CL;

            // calculate total score
            if (!this.__submitted) {
                this.__submitted = true;

                if (equations == null) {
                    return;
                }

                let correctAnswers = 0;
                for (let r = 0; r < equations.length; r++) {
                    for (let c = 0; c < equations[r].length; c++) {
                        if (equations[r][c].answer == equations[r][c].playerAnswer.value) {
                            correctAnswers++;
                        }
                        else {
                            equations[r][c].playerAnswer.style.backgroundColor = "red";
                        }
                    }
                }

                document.getElementById("score").innerText = correctAnswers;
            }
        });

        this.__button.addEventListener("mouseup", (e) => {
            e.target.style.backgroundColor = Submit.HOVER_CL;
        });

        this.__button.addEventListener("touchstart", (e) => {
            e.target.style.backgroundColor = Submit.CLICK_CL;
        });

        this.__button.addEventListener("touchend", (e) => {
            e.target.style.backgroundColor = Submit.DEF_CL;
        });
    }

    get button() {
        return this.__button;
    }
}


let exam = new Exam();

let submit = new Submit(Submit.ID, exam.equations);
