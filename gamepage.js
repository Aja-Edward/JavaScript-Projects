const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById('questionCounter');
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const scoreText = document.getElementById('score');
let difficulty = localStorage.getItem('difficulty') || 'easy';
let numQuestions = localStorage.getItem('numQuestions') || 10;

function setDifficulty(difficultyLevel) {
    difficulty = difficultyLevel;
}

document.querySelectorAll('.radiobtn').forEach(difficultyRadio => {
    difficultyRadio.addEventListener('change', (e) => {
        difficulty = e.target.dataset.difficulty;

    })
})

console.log({ difficulty }, localStorage.getItem('difficulty'))

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

function startQuiz() {

}

fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=9&difficulty=${difficulty}&type=multiple`)
    .then(res => {
        return res.json();
    })
    .then(({ results }) => {
        console.log(results);
        questions = results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            });
            return formattedQuestion;
        });


        startGame()
        // questions = loadedQuestions;
        // startGame();
    })


    .catch(err => {
        console.error(err);
    });


//CONSTANTS//
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = numQuestions;
console.log(questions);

startGame = () => {
    questionCounter = 0;
    score = 0;
    questionCounter = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");

};
getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);

        //go to the end page
        return window.location.assign('gamescore.html');
    }
    questionCounter++;

    // questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS;
    questionCounterText.innerText = `${questionCounter} /${availableQuestions.length}`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        //class to apply after selection
        // const classToApply = 'incorrect';
        // if (selectedAnswer == currentQuestion.answer) {
        //     classToApply = 'correct';
        // }
        //Another way to do this is with tenary operator
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS)
        }
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);

    });

})
incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}


