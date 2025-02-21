document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question-container");
    const answerButtons = document.getElementById("answer-buttons");
    const resultContainer = document.getElementById("result-container");
    const categoryContainer = document.getElementById("category-container");
    const restartButton = document.getElementById("restart-btn");
    const logoutButton = document.getElementById("logout-btn");
    const addQuestionForm = document.getElementById("add-question-form");
    
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let userAnswers = [];

    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "index.html";
        return;
    }

    async function fetchCategories() {
        try {
            const response = await fetch("/categories");
            const categories = await response.json();
            categoryContainer.innerHTML = "";

            categories.forEach(category => {
                const button = document.createElement("button");
                button.classList.add("category-btn");
                button.textContent = category.name;
                button.dataset.category = category.id;
                button.onclick = () => fetchQuestions(category.id);
                categoryContainer.appendChild(button);
            });
        } catch (error) {
            console.error("Villa við að sækja flokka:", error);
        }
    }

    async function fetchQuestions(categoryId) {
        try {
            const response = await fetch(`/questions/${categoryId}`);
            currentQuestions = await response.json();

            if (!currentQuestions.length) {
                alert("Engar spurningar fundust fyrir þennan flokk.");
                return;
            }

            startQuiz();
        } catch (error) {
            console.error("Villa við að sækja spurningar:", error);
        }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        userAnswers = [];
        showQuestion();
        resultContainer.classList.add("hide");
    }

    function showQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            showResults();
            return;
        }

        const questionData = currentQuestions[currentQuestionIndex];
        questionContainer.innerText = questionData.question;
        answerButtons.innerHTML = "";

        questionData.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.classList.add("btn");
            button.innerText = answer.answer;
            button.onclick = () => selectAnswer(index, answer.correct);
            answerButtons.appendChild(button);
        });
    }

    function selectAnswer(index, isCorrect) {
        userAnswers[currentQuestionIndex] = isCorrect;
        currentQuestionIndex++;
        showQuestion();
    }

    function showResults() {
        const correctAnswers = userAnswers.filter(ans => ans === true).length;
        resultContainer.classList.remove("hide");
        resultContainer.innerHTML = `
            <h2>${correctAnswers >= currentQuestions.length / 2 ? "Vel gert!" : "Gengur betur næst!"}</h2>
            <p>Þú fékkst ${correctAnswers} af ${currentQuestions.length} rétt!</p>
        `;
    }

    restartButton.addEventListener("click", () => {
        startQuiz();
    });

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        });
    }

    if (addQuestionForm) {
        addQuestionForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const questionInput = document.getElementById("new-question");
            const categorySelect = document.getElementById("question-category");
            const correctAnswerInput = document.getElementById("correct-answer");
            const wrongAnswers = [
                document.getElementById("wrong-answer-1").value,
                document.getElementById("wrong-answer-2").value,
                document.getElementById("wrong-answer-3").value
            ];
    
            const newQuestion = {
                question: questionInput.value,
                category_id: categorySelect.value,
                answers: [
                    { answer: correctAnswerInput.value, correct: true },
                    ...wrongAnswers.map(answer => ({ answer, correct: false }))
                ]
            };
    
            console.log("Ný spurning sem er send:", newQuestion); 
    
            try {
                const response = await fetch("/questions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newQuestion)
                });
    
                const data = await response.json();
                console.log("Svör frá API:", data); 
    
                if (response.ok) {
                    alert("Spurning bætt við!");
                    questionInput.value = "";
                    correctAnswerInput.value = "";
                    document.getElementById("wrong-answer-1").value = "";
                    document.getElementById("wrong-answer-2").value = "";
                    document.getElementById("wrong-answer-3").value = "";
                } else {
                    alert("Villa: " + data.message);
                }
            } catch (error) {
                console.error("Villa við að bæta við spurningu:", error);
            }
        });
    }
    

    fetchCategories();
});
