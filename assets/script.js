const questions = [
    {
        question: "What does HTML stand for?",
        choices: [
            "Hypertext Markup Language",
            "Hypertext Mark Language",
            "Hyper Talking Mark Language",
            "Hypertext Moving Language"
        ],
        correctAnswer: "Hypertext Markup Language"
    },
    {
        question: "What does CSS stand for?",
        choices: [
            "Cascading Style Sheets",
            "Card Style Sheets",
            "Cascading Starting Sheets",
            "Cascading Starting Start"
        ],
        correctAnswer: "Cascading Style Sheets"
    },
    {
        question: "What would you type in a file in vscode to be able to type JavaScript?",
        choices: [
            "script.js",
            "jscript.css",
            "jscript.html",
            "javascript.css"
        ],
        correctAnswer: "script.js"
    }
];

const startButton = document.getElementById("start-btn");
const questionContainer = document.getElementById("question");
const choicesContainer = document.getElementById("choices");
const timeLeft = document.getElementById("time-left");
const scoreDisplay = document.getElementById("score");
const submitScoreButton = document.getElementById("submit-score");
const initialsInput = document.getElementById("initials");
const leaderboardList = document.getElementById("leaderboard-list");

let currentQuestionIndex = 0;
let time = 60; // in seconds
let timerInterval;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

startButton.addEventListener("click", startQuiz);
submitScoreButton.addEventListener("click", saveScore);

function startQuiz() {
    startButton.disabled = true;
    startTimer();
    showQuestion();
    displayHighScores();
    submitScoreButton.style.display = "none"; // Hide the Submit button
}
function startTimer() {
    timeLeft.textContent = time;

    timerInterval = setInterval(function() {
        time--;
        timeLeft.textContent = time;

        if (time <= 0 || currentQuestionIndex >= questions.length) {
            clearInterval(timerInterval);
            if (time < 0) {
                time = 0; // Ensure time is not negative
            }
            endQuiz();
        }
    }, 1000);
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        questionContainer.textContent = question.question;
        choicesContainer.innerHTML = "";

        question.choices.forEach((choice, index) => {
            const choiceButton = document.createElement("button");
            choiceButton.textContent = choice;
            choiceButton.classList.add("choice");
            choiceButton.style.display = "none"; // Hide the answer buttons
            choiceButton.addEventListener("click", function() {
                checkAnswer(choice, question.correctAnswer);
            });
            choicesContainer.appendChild(choiceButton);
        });

        // Reveal the answer buttons
        const choiceButtons = choicesContainer.querySelectorAll(".choice");
        choiceButtons.forEach(button => {
            button.style.display = "block";
        });
    } else {
        endQuiz();
    }
}
function checkAnswer(selectedChoice, correctAnswer) {
    if (selectedChoice === correctAnswer) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        time -= 10; // Penalty for wrong answer
    }
}

function endQuiz() {
    questionContainer.textContent = "Quiz is over!";
    choicesContainer.innerHTML = "";
    
    let finalScore = time + 1;
    if (finalScore > 60) {
        finalScore = 60; // Cap the score at 60
    }
    
    scoreDisplay.textContent = finalScore;
    submitScoreButton.style.display = "block"; // Show the Submit button

    const scoreForm = document.getElementById("score-form");
    scoreForm.style.display = "block"; // Show the initials input
}



function saveScore() {
    const initials = initialsInput.value.trim();
    if (initials !== "") {
        const finalScore = time + 1;
        const scoreEntry = { initials, score: finalScore };
        highScores.push(scoreEntry);
        localStorage.setItem("highScores", JSON.stringify(highScores));
        initialsInput.value = "";
        submitScoreButton.style.display = "none"; // Hide the Submit button
        displayHighScores();
    }
}

function displayHighScores() {
    // Sort highScores in descending order based on score
    highScores.sort((a, b) => b.score - a.score);

    leaderboardList.innerHTML = "";

    highScores.forEach((scoreEntry, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${scoreEntry.initials}: ${scoreEntry.score}`;
        leaderboardList.appendChild(listItem);
    });
}
