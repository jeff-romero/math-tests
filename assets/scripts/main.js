
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
                // default to addition
                this.__operator = Exam.ADD;
                this.calc();
                break;
        }
    }
}


class Timer {
    static HR_ID = "hour";
    static MIN_ID = "minute";
    static SEC_ID = "second";
    static MS_ID = "millisecond";

    constructor(hour_id=Timer.HR_ID, minute_id=Timer.MIN_ID, second_id=Timer.SEC_ID, millisecond_id=Timer.MS_ID) {
        this.__hr = document.getElementById(hour_id);
        this.__min = document.getElementById(minute_id);
        this.__sec = document.getElementById(second_id);
        this.__ms = document.getElementById(millisecond_id);
        this.__started = false;

        let timerCheckbox = document.getElementById("showTimer");
        let timer = document.getElementById("timerWrapper");
        timerCheckbox.addEventListener("change", () => {
            if (timerCheckbox.checked) {
                timer.style.zIndex = 0;
            }
            else {
                timer.style.zIndex = -1;
            }
        });
    }

    get started() {
        return this.__started;
    }

    start() {
        if (this.__started) {
            return;
        }

        this.__started = true;

        let timer = setInterval(() => {
            if (parseInt(this.__ms.innerText) + 1 > 9) {
                this.__sec.innerText = parseInt(this.__sec.innerText) + 1;
                if (this.__sec.innerText < 10) {
                    this.__sec.innerText = "0".concat(this.__sec.innerText);
                }
                this.__ms.innerText = 0;
            }
            else {
                this.__ms.innerText = parseInt(this.__ms.innerText) + 1;
            }

            if (parseInt(this.__sec.innerText) + 1 > 60) {
                this.__min.innerText = parseInt(this.__min.innerText) + 1;
                if (this.__min.innerText < 10) {
                    this.__min.innerText = "0".concat(this.__min.innerText);
                }
                this.__sec.innerText = 0;
            }

            if (parseInt(this.__min.innerText) + 1 > 60) {
                if (this.__hr.innerText + 1 > 99) {
                    clearInterval(timer);
                }

                this.__hr.innerText = parseInt(this.__hr.innerText) + 1;
                if (this.__hr.innerText < 10) {
                    this.__hr.innerText = "0".concat(this.__hr.innerText);
                }
                this.__min.innerText = 0;
            }
        }, 100);
    }
}


class Exam {
    static DEFAULT_TOTAL_EQUATIONS = 100;
    static MIN_OPERAND = 1;
    static MAX_OPERAND = 12;
    static ADD = "+";
    static SUB = "-";
    static MULT = "×";
    static DIV = "/";

    constructor(min=Exam.MIN_OPERAND, max=Exam.MAX_OPERAND, totalEquations=Exam.DEFAULT_TOTAL_EQUATIONS) {
        this.__totalEquations = totalEquations;
        this.__min = min;
        this.__max = max;
        this.__playerAnswers = [];
        this.__equations = [];
        // TODO: add more operators
        this.__operators = [Exam.MULT];
        this.__showErrors = null;
        this.__timer = new Timer();

        this.updateTotalEquationCount();

        this.initializeBackEndEquations();

        this.initializeFrontEndEquations();

        this.createShowErrorHandler();
    }

    get equations() {
        return this.__equations;
    }

    updateTotalEquationCount() {
        document.getElementById("total").innerText = this.__totalEquations;
    }

    createShowErrorHandler() {
        this.__showErrors = document.getElementById("showErrors");

        this.__showErrors.addEventListener("change", () => {
            if (this.__equations.length == 0 || document.getElementById("score").innerText.length > 0) {
                return;
            }

            for (let i = 0; i < this.__totalEquations; i++) {
                let currentEquation = this.__equations[i];

                if (!currentEquation || !currentEquation.playerAnswer) {
                    continue;
                }

                if (this.__showErrors.checked && currentEquation.playerAnswer.value.length > 0 && currentEquation.answer != currentEquation.playerAnswer.value) {
                    currentEquation.playerAnswer.style.backgroundColor = "red";
                }
                else {
                    currentEquation.playerAnswer.style.backgroundColor = "white";
                }
            }
        });
    }

    initializeBackEndEquations() {
        for (let i = 0; i < this.__totalEquations; i++) {
            this.__equations.push(this.createEquation());
        }
    }

    createEquation() {
        let numerator = Math.floor((Math.random() * this.__max) + this.__min);
        let denominator = Math.floor((Math.random() * this.__max) + this.__min);
        let operator = this.__operators[Math.floor(Math.random() * this.__operators.length)];

        return new Equation(numerator, denominator, operator);
    }

    initializeFrontEndEquations() {
        let root = document.getElementById("bottom");
        const realNumbersPattern = /^(?=[-0-9.])+(-?[0-9]*)(.[0-9]*)?$/;

        for (let i = 0; i < this.__equations.length; i++) {
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

            let currentEq = this.__equations[i];
            currentEq.playerAnswer = playerAnswer;

            playerAnswer.addEventListener("input", (e) => {
                if (realNumbersPattern.exec(e.target.value) == null) {
                    e.target.value = e.target.value.slice(0, -1);
                }
            });

            playerAnswer.addEventListener("change", (e) => {
                if (!this.__timer.started) {
                    this.__timer.start()
                }

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

            root.appendChild(equation);
        }
    }
}


class Submit {
    static ID = "submit";
    static DEF_CL = "rgb(170, 170, 170)";
    static HOVER_CL = "rgb(150, 150, 150)";
    static CLICK_CL = "rgb(130, 130, 130)";
    static DISABLED_CL = "rgb(43, 43, 43)";

    constructor(id=Submit.ID, equations=null) {
        this.__submitted = false;
        this.__button = document.getElementById(id);

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
                for (let i = 0; i < equations.length; i++) {
                    if (equations[i].answer == equations[i].playerAnswer.value) {
                        correctAnswers++;
                    }
                    else {
                        equations[i].playerAnswer.style.backgroundColor = "red";
                    }
                }

                document.getElementById("score").innerText = correctAnswers;

                e.target.style.backgroundColor = Submit.DISABLED_CL;
                e.target.setAttribute("inert", "");
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
