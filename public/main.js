document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.getElementById("question-container");
  const answerButtons = document.getElementById("answer-buttons");
  const resultContainer = document.getElementById("result-container");
  const nextButton = document.getElementById("next-btn");
  const backButton = document.getElementById("back-btn");
  const finishButton = document.getElementById("finish-btn");
  const restartButton = document.getElementById("restart-btn");
  const addQuestionButton = document.getElementById("add-question-btn");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const categorySelect = document.getElementById("question-category");
  const clearQuestionsButton = document.getElementById("clear-questions-btn");

  let categories = {};
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let answerSelected = false;
  
  const questionInput = document.getElementById("new-question");
    const correctAnswerInput = document.getElementById("correct-answer");
    const wrongAnswerInputs = [
        document.getElementById("wrong-answer-1"),
        document.getElementById("wrong-answer-2"),
        document.getElementById("wrong-answer-3")
    ];

  fetch("data/index.json")
      .then(response => response.json())
      .then(data => {
          data.forEach(entry => {
              if (entry.title && entry.file) {
                  categories[entry.title.toLowerCase()] = entry.file;
              }
          });
      })
      .catch(error => console.error("Villa við að sækja index.json:", error));

  categoryButtons.forEach(button => {
      button.addEventListener("click", () => {
          categoryButtons.forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");
          loadCategory(button.dataset.category);
      });
  });

  function loadCategory(category) {
    const file = categories[category];
    if (!file) {
        console.error("Engin skrá fundin fyrir", category);
        return;
    }

    fetch(`data/${file}`)
        .then(response => response.json())
        .then(data => {
            // 🟢 Bæta bara við nýjar spurningar sem tilheyra valda flokknum!
            const newQuestions = currentQuestions.filter(q => q.category === category);
            currentQuestions = shuffleArray([...data.questions, ...newQuestions]);

            currentQuestionIndex = 0;
            userAnswers = [];
            showQuestion();
        })
        .catch(error => console.error(`Villa við að sækja ${file}:`, error));
}

  function showQuestion() {
      resetState();
      answerSelected = false;
      if (currentQuestionIndex >= currentQuestions.length) {
          showResults();
          return;
      }
      
      const questionData = currentQuestions[currentQuestionIndex];
      questionContainer.innerText = questionData.question;
      
      shuffleArray(questionData.answers).forEach((answer, index) => {
          const button = document.createElement("button");
          button.innerText = answer.answer;
          button.classList.add("btn");
          button.dataset.index = index;
          button.addEventListener("click", () => selectAnswer(index, button));
          answerButtons.appendChild(button);
      });
      
      updateNavigationButtons();
  }

  function resetState() {
      while (answerButtons.firstChild) {
          answerButtons.removeChild(answerButtons.firstChild);
      }
      questionContainer.classList.remove("hide");
      answerButtons.classList.remove("hide");
      resultContainer.classList.add("hide");
      restartButton.classList.add("hide");
  }

  function selectAnswer(index, button) {
    clearSelection();
    userAnswers[currentQuestionIndex] = index;
    button.classList.add("selected");
    answerSelected = true;
    updateNavigationButtons();
}


  function clearSelection() {
      document.querySelectorAll(".btn").forEach(button => {
          button.classList.remove("selected");
      });
  }

  function showResults() {
      questionContainer.classList.add("hide");
      answerButtons.classList.add("hide");
      nextButton.classList.add("hide");
      backButton.classList.add("hide");
      finishButton.classList.add("hide");
      resultContainer.classList.remove("hide");
      restartButton.classList.remove("hide");
      
      let correctAnswers = 0;
      currentQuestions.forEach((question, qIndex) => {
          if (question.answers[userAnswers[qIndex]]?.correct) {
              correctAnswers++;
          }
      });
      
      resultContainer.innerHTML = `<h2>Þú varst með ${correctAnswers}/${currentQuestions.length} rétt!</h2>`;
      
      currentQuestions.forEach((question, qIndex) => {
          const questionDiv = document.createElement("div");
          questionDiv.classList.add("result-box");
          questionDiv.innerHTML = `<p><strong>${question.question}</strong></p>`;
          question.answers.forEach((answer, aIndex) => {
              const answerP = document.createElement("p");
              answerP.innerText = answer.answer;
              if (aIndex === userAnswers[qIndex]) {
                  answerP.style.color = answer.correct ? "green" : "red";
              }
              questionDiv.appendChild(answerP);
          });
          resultContainer.appendChild(questionDiv);
      });
  }

  nextButton.addEventListener("click", () => {
      if (!answerSelected) return;
      currentQuestionIndex++;
      showQuestion();
  });

  backButton.addEventListener("click", () => {
      if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          showQuestion();
      }
  });

  finishButton.addEventListener("click", () => {
      showResults();
  });

  restartButton.addEventListener("click", () => {
      currentQuestionIndex = 0;
      userAnswers = [];
      showQuestion();
  });
  


  function updateNavigationButtons() {
      if (answerSelected) {
          if (currentQuestionIndex === currentQuestions.length - 1) {
              nextButton.classList.add("hide");
              finishButton.classList.remove("hide");
          } else {
              nextButton.classList.remove("hide");
              finishButton.classList.add("hide");
          }
      } else {
          nextButton.classList.add("hide");
      }
      
      if (currentQuestionIndex === 0) {
          backButton.classList.add("hide");
      } else {
          backButton.classList.remove("hide");
      }
  }

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }


clearQuestionsButton.addEventListener("click", () => {
  if (currentQuestions.length === 0) {
      alert("Engin ný spurning hefur verið búin til :)");
      return;
  }

  currentQuestions = []; 
  questionContainer.innerHTML = ""; 
});
addQuestionButton.addEventListener("click", () => {
  const category = categorySelect.value;
  const questionText = questionInput.value.trim();
  const correctAnswer = correctAnswerInput.value.trim();
  const wrongAnswers = wrongAnswerInputs.map(input => input.value.trim()).filter(answer => answer !== "");

  if (!questionText || !correctAnswer || wrongAnswers.length < 2) {
      alert("Vinsamlegast skráðu spurningu, rétt svar og að minnsta kosti 2 röng svör.");
      return;
  }

  const newQuestion = {
      question: questionText,
      category: category,
      answers: [
          { answer: correctAnswer, correct: true },
          ...wrongAnswers.map(answer => ({ answer, correct: false }))
      ]
  };

  currentQuestions.push(newQuestion); 
 
  if (currentQuestions.length === 1) {
      showQuestion();
  }

  
  questionInput.value = "";
  correctAnswerInput.value = "";
  wrongAnswerInputs.forEach(input => input.value = "");
});

});
