document.addEventListener("DOMContentLoaded", () => {
    const categoryContainer = document.getElementById("category-container");
    const questionContainer = document.getElementById("question-container");
    const answerButtons = document.getElementById("answer-buttons");
    const resultContainer = document.getElementById("result-container");
    const restartButton = document.getElementById("restart-btn");
    const quizContainer = document.getElementById("quiz-container");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const finishButton = document.getElementById("finish-btn");

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let userAnswers = [];

    categoryContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("category-btn")) {
            const file = event.target.dataset.file;
            fetchQuestions(file);
        }
    });

    async function fetchQuestions(file) {
        try {
            const response = await fetch(`/quiz/${file}`);
            const data = await response.json();

            if (!Array.isArray(data.questions) || data.questions.length === 0) {
                alert("Engar spurningar fundust.");
                return;
            }

            currentQuestions = shuffleArray(data.questions);
            userAnswers = new Array(currentQuestions.length).fill(null);
            startQuiz();
        } catch (error) {
            console.error("Villa við að sækja spurningar:", error);
        }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        quizContainer.classList.remove("hide");
        categoryContainer.classList.add("hide");
        resultContainer.classList.add("hide");
        restartButton.classList.add("hide");
        showQuestion();
    }

    function showQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            showResults();
            return;
        }

        const questionData = currentQuestions[currentQuestionIndex];
        questionContainer.innerText = questionData.question;
        answerButtons.innerHTML = "";

        const shuffledAnswers = shuffleArray(questionData.answers);

        shuffledAnswers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.classList.add("btn");
            button.innerText = answer.answer;
            button.dataset.correct = answer.correct;
            button.onclick = () => selectAnswer(index, answer.correct);
            answerButtons.appendChild(button);
        });

        nextButton.classList.add("hide");
        finishButton.classList.add("hide");
        updateNavigationButtons();
    }

    function selectAnswer(index, isCorrect) {
        userAnswers[currentQuestionIndex] = { selected: index, correct: isCorrect };

        document.querySelectorAll(".btn").forEach((btn, i) => {
            btn.classList.remove("selected");
            if (i === index) btn.classList.add("selected");
        });

        if (currentQuestionIndex === currentQuestions.length - 1) {
            finishButton.classList.remove("hide");
            nextButton.classList.add("hide");
        } else {
            nextButton.classList.remove("hide");
        }
    }

    function showResults() {
        quizContainer.classList.add("hide");
        resultContainer.classList.remove("hide");

        const correctAnswers = userAnswers.filter(ans => ans && ans.correct).length;
        resultContainer.innerHTML = `<h2>Þú fékkst ${correctAnswers} af ${currentQuestions.length} rétt!</h2>`;

        currentQuestions.forEach((question, i) => {
            const userAnswer = userAnswers[i];
            const correctAnswer = question.answers.find(a => a.correct).answer;

            let answerButtonsHtml = "";
            question.answers.forEach((answer, index) => {
                const isSelected = userAnswer && userAnswer.selected === index;
                const isCorrect = answer.correct;

                let color = "black";
                if (isSelected) {
                    color = isCorrect ? "green" : "red";
                }

                answerButtonsHtml += `<span style="color: ${color};">${answer.answer}</span><br>`;
            });

            resultContainer.innerHTML += `
                <p>
                    <strong>${question.question}</strong><br>
                    ${answerButtonsHtml}
                </p>
            `;
        });

        restartButton.classList.remove("hide");
    }

    nextButton.addEventListener("click", () => {
        if (userAnswers[currentQuestionIndex] === null) {
            alert("Þú verður að velja svar áður en þú heldur áfram!");
            return;
        }
        currentQuestionIndex++;
        showQuestion();
    });

    backButton.addEventListener("click", () => {
        currentQuestionIndex--;
        showQuestion();
    });

    finishButton.addEventListener("click", showResults);

    restartButton.addEventListener("click", () => {
        quizContainer.classList.add("hide");
        resultContainer.classList.add("hide");
        restartButton.classList.add("hide");
        categoryContainer.classList.remove("hide");
        nextButton.classList.add("hide");
        backButton.classList.add("hide");
        finishButton.classList.add("hide");
    });

    function updateNavigationButtons() {
        nextButton.classList.add("hide");
        backButton.classList.toggle("hide", currentQuestionIndex === 0);

        if (currentQuestionIndex === currentQuestions.length - 1) {
            nextButton.classList.add("hide");
            finishButton.classList.remove("hide");
        } else {
            nextButton.classList.remove("hide");
            finishButton.classList.add("hide");
        }
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }
});
