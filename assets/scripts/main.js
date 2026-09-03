
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

        // checkbox can already be checked if user refreshes the page (not force reload)
        if (timerCheckbox.checked) {
            timer.style.zIndex = 0;
        }

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
    static MAX_DIV_NUMERATOR = 144;
    static ADD = "+";
    static SUB = "-";
    static MULT = "×";
    static DIV = "/";

    constructor(min=Exam.MIN_OPERAND, max=Exam.MAX_OPERAND, totalEquations=Exam.DEFAULT_TOTAL_EQUATIONS) {
        this.__totalEquations = totalEquations;
        this.__min = min;
        this.__max = max;
        this.__equations = [];
        // TODO: add more operators
        this.__operators = [Exam.DIV];
        this.__showErrors = null;
        this.__timer = new Timer();

        this.updateTotalEquationCount();

        this.initializeBackEndEquations();

        this.initializeFrontEndEquations();

        this.createShowErrorHandler();
    }

    restart(operators) {
        console.log("restarting exam...");

        while (this.__equations.length > 0) {
            this.__equations.pop();
        }

        this.updateSelectedOperators(operators);

        // this.updateTotalEquationCount();

        this.initializeBackEndEquations();

        this.initializeFrontEndEquations();

        this.createShowErrorHandler();
    }

    get equations() {
        return this.__equations;
    }

    updateSelectedOperators(operators) {
        if (operators === undefined || operators.length == 0) {
            return;
        }

        while (this.__operators.length > 0) {
            this.__operators.pop();
        }

        for (let i = 0; i < operators.length; i++) {
            this.__operators.push(operators[i]);
        }
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
        let operator = this.__operators[Math.floor(Math.random() * this.__operators.length)];
        let numerator;
        let denominator;

        if (operator == Exam.DIV) {
            numerator = Math.floor((Math.random() * Exam.MAX_DIV_NUMERATOR) + this.__min);
        }
        else {
            numerator = Math.floor((Math.random() * this.__max) + this.__min);
        }

        denominator = Math.floor((Math.random() * this.__max) + this.__min);

        if (operator == Exam.DIV) {
            while (true) {
                let answer = numerator / denominator;
                
                if (denominator < numerator && answer % 1 == 0) {
                    break;
                }

                numerator = Math.floor((Math.random() * Exam.MAX_DIV_NUMERATOR) + this.__min);
                denominator = Math.floor((Math.random() * (Exam.MAX_DIV_NUMERATOR - 1)) + this.__min);
            }
        }

        return new Equation(numerator, denominator, operator);
    }

    initializeFrontEndEquations() {
        let root = document.getElementById("bottom");

        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }

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


class Controller {
    static DEFAULT_OPERATOR = Exam.MULT;
    static SETTINGS_BTN_COLORS = {
        "mouseover": "",
        "mouseleave": "",
        "mousedown": "",
        "mouseup": "",
        "touchstart": "",
        "touchend": ""
    };
    static CLOSE_BTN_COLORS = {
        "mouseover": "#E81123",
        "mouseleave": "#383838",
        "mousedown": "#F16F7A",
        "mouseup": "#E81123",
        "touchstart": "#F16F7A",
        "touchend": "#383838"
    };
    static APPLY_BTN_COLORS = {
        "inert": "#cccccc80",
        "active": "#cccccc",
        "mouseover": "#868686",
        "mouseleave": "#cccccc",
        "mousedown": "#464646",
        "mouseup": "#868686",
        "touchstart": "#464646",
        "touchend": "#cccccc"
    };

    constructor(exam) {
        this.exam = exam;

        this.toggleSettings = document.getElementById("toggleSettings");
        this.settings = document.getElementById("settings");
        this.settings.style.display = getComputedStyle(this.settings).display;
        this.close = document.getElementById("close");
        this.apply = document.getElementById("apply");

        this.addCheckbox = document.getElementById("addCheckbox");
        this.subCheckbox = document.getElementById("subCheckbox");
        this.mulCheckbox = document.getElementById("mulCheckbox");
        this.divCheckbox = document.getElementById("divCheckbox");

        this.handleSettingsButton();

        this.initializeCloseButtonStyling();

        this.disableApplyButton();

        this.initializeApplyButtonStyling();

        this.initializeDefaultOperator();

        this.handleOperatorCheckboxes();

        this.handleApplySettings();
    }

    handleSettingsButton() {
        this.toggleSettings.addEventListener("mouseover", (e) => {

        });

        this.toggleSettings.addEventListener("mouseleave", (e) => {

        });

        this.toggleSettings.addEventListener("mousedown", (e) => {

        });

        this.toggleSettings.addEventListener("mouseup", (e) => {
            if (this.settings.style.display == "none") {
                this.settings.style.display = "flex";
            }
            else {
                this.settings.style.display = "none";
            }
        });

        this.toggleSettings.addEventListener("touchstart", (e) => {

        });

        this.toggleSettings.addEventListener("touchend", (e) => {
            if (this.settings.style.display == "none") {
                this.settings.style.display = "flex";
            }
            else {
                this.settings.style.display = "none";
            }
        });
    }

    initializeCloseButtonStyling() {
        this.close.addEventListener("mouseover", (e) => {
            e.target.style.backgroundColor = Controller.CLOSE_BTN_COLORS["mouseover"];
        });

        this.close.addEventListener("mouseleave", (e) => {
            e.target.style.backgroundColor = Controller.CLOSE_BTN_COLORS["mouseleave"];
        });

        this.close.addEventListener("mousedown", (e) => {
            e.target.style.backgroundColor = Controller.CLOSE_BTN_COLORS["mousedown"];
        });

        this.close.addEventListener("mouseup", (e) => {
            e.target.style.backgroundColor = Controller.CLOSE_BTN_COLORS["mouseup"];
            this.settings.style.display = "none";
        });

        this.close.addEventListener("touchstart", (e) => {
            e.target.style.backgroundColor = Controller.CLOSE_BTN_COLORS["touchstart"];
        });

        this.close.addEventListener("touchend", (e) => {
            e.target.style.backgroundColor = Controller.CLOSE_BTN_COLORS["touchend"];
            this.settings.style.display = "none";
        });
    }

    initializeApplyButtonStyling() {
        this.apply.addEventListener("mouseover", (e) => {
            e.target.style.backgroundColor = Controller.APPLY_BTN_COLORS["mouseover"];
        });

        this.apply.addEventListener("mouseleave", (e) => {
            e.target.style.backgroundColor = Controller.APPLY_BTN_COLORS["mouseleave"];
        });

        this.apply.addEventListener("mousedown", (e) => {
            e.target.style.backgroundColor = Controller.APPLY_BTN_COLORS["mousedown"];
        });

        this.apply.addEventListener("mouseup", (e) => {
            e.target.style.backgroundColor = Controller.APPLY_BTN_COLORS["mouseup"];

            this.disableApplyButton();
        });

        this.apply.addEventListener("touchstart", (e) => {
            e.target.style.backgroundColor = Controller.APPLY_BTN_COLORS["touchstart"];
        });

        this.apply.addEventListener("touchend", (e) => {
            e.target.style.backgroundColor = Controller.APPLY_BTN_COLORS["touchend"];

            this.disableApplyButton();
        });
    }

    initializeDefaultOperator() {
        for (let i = 0; i < this.exam.__operators.length; i++) {
            switch (this.exam.__operators[i]) {
                case Exam.ADD:
                    this.addCheckbox.checked = true;
                    break;
                case Exam.SUB:
                    this.subCheckbox.checked = true;
                    break;
                case Exam.MULT:
                    this.mulCheckbox.checked = true;
                    break;
                case Exam.DIV:
                    this.divCheckbox.checked = true;
                    break;
                default:
                    break;
            }
        }
    }

    disableApplyButton() {
        this.apply.style.backgroundColor = Controller.APPLY_BTN_COLORS["inert"];
        this.apply.setAttribute("inert", "");
    }

    enableApplyButton() {
        if (this.apply.attributes.getNamedItem("inert")) {
            this.apply.removeAttribute("inert");

            this.apply.style.backgroundColor = Controller.APPLY_BTN_COLORS["active"];
        }
    }

    handleOperatorCheckboxes() {
        this.addCheckbox.addEventListener("change", (e) => {
            this.enableApplyButton();

            if (e.target.checked) {

            }
            else {

            }
        });

        this.subCheckbox.addEventListener("change", (e) => {
            this.enableApplyButton();

            if (e.target.checked) {

            }
            else {
                
            }
        });

        this.mulCheckbox.addEventListener("change", (e) => {
            this.enableApplyButton();

            if (e.target.checked) {

            }
            else {
                
            }
        });

        this.divCheckbox.addEventListener("change", (e) => {
            this.enableApplyButton();

            if (e.target.checked) {

            }
            else {
                
            }
        });
    }

    handleApplySettings() {
        this.apply.addEventListener("click", (e) => {
            e.target.setAttribute("inert", "");
        });
    }

    restart() {
        let operators = [];

        if (this.addCheckbox.checked) {
            console.log('add checked');
            operators.push(Exam.ADD);
        }

        if (this.subCheckbox.checked) {
            console.log('sub checked');
            operators.push(Exam.SUB);
        }

        if (this.mulCheckbox.checked) {
            console.log('mul checked');
            operators.push(Exam.MULT);
        }

        if (this.divCheckbox.checked) {
            console.log('div checked');
            operators.push(Exam.DIV);
        }

        this.exam.restart(operators);
    }
}


let exam = new Exam();

let submit = new Submit(Submit.ID, exam.equations);

let controller = new Controller(exam);
