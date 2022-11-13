let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let againButton = document.querySelector(".again");

againButton.onclick = function(){
    location.reload();
}


let currentIndex = 0;

let rightAnswers = 0;

let countdownInterval;


function getQuestion() {

    let myRequset = new XMLHttpRequest();

    myRequset.onreadystatechange = function(){

        if(this.readyState === 4 && this.status === 200){

            let questionsObject = JSON.parse(this.responseText);

            let questionscount = questionsObject.length;

            createBullets(questionscount);

            addQuestionsData(questionsObject[currentIndex] , questionscount)

            countdown(60 , questionscount);

            submitButton.onclick = () =>{
                let rightanswer = questionsObject[currentIndex].right_answer;

                currentIndex++;

                checkAnswer(rightanswer , questionscount);


                addQuestionsData(questionsObject[currentIndex] , questionscount);

                hundleBullets();

                clearInterval(countdownInterval);

                countdown(60 , questionscount);

                showResult(questionscount);
            };
        }
    };

    myRequset.open("GET" , "html_questions.json", true);

    myRequset.send();
}

getQuestion();

function createBullets(num) {

    countSpan.innerHTML = num;

    for(let i = 0  ; i< num ; i++)
    {
        let theBullet = document.createElement("span");

        if(i === 0)
        {
            theBullet.className = "on"
        }

        bulletsContainer.appendChild(theBullet);
    }

}

function addQuestionsData(obj , count){
    quizArea.innerHTML = "";

    answersArea.innerHTML = "";

    if( currentIndex < count)
{
    let questionTitlel = document.createElement("h2");

    let questionText = document.createTextNode(obj["title"]);

    questionTitlel.appendChild(questionText);

    quizArea.appendChild(questionTitlel);

    for(let i =1 ; i<=4 ; i++)
    {
        let mainDiv = document.createElement("div");

        mainDiv.className = "answer";

        let radioInput = document.createElement("input");

        radioInput.name = "question";

        radioInput.type = "radio";

        radioInput.id = `answer_${i}`;

        radioInput.dataset.answer = obj[`answer_${i}`];

        if(i=== 1 ){
            radioInput.checked = true ;
        }

        let thelabel = document.createElement("label");

        thelabel.htmlFor = `answer_${i}`;

        let thelabeltext = document.createTextNode(obj[`answer_${i}`]);

        thelabel.appendChild(thelabeltext);

        mainDiv.appendChild(radioInput);

        mainDiv.appendChild(thelabel);

        answersArea.appendChild(mainDiv);

    }
}
}

function checkAnswer(rAnswer , count){
    let answers = document.getElementsByName("question");

    let choosenAnswer;

    for(let i = 0 ; i< answers.length ; i++ )
    {
        if(answers[i].checked){
            choosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === choosenAnswer)
    {
        rightAnswers++;
    }
}

function hundleBullets(){
    let bulletsSpan  = document.querySelectorAll(".bullets .spans span");
    let arrayofSpans = Array.from(bulletsSpan);

    arrayofSpans.forEach((span , index)=>{
        if(currentIndex === index)
        {
            span.className ="on";
        }
    });
}

function showResult (count){
    let TheResults;

    if(currentIndex === count)
    {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers > (count / 2) && rightAnswers < count)
        {
            TheResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count){
            TheResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else{
            TheResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }

        resultsContainer.innerHTML = TheResults;

        resultsContainer.style.padding = "10px";

        resultsContainer.style.backgroundColor = "white";

        resultsContainer.style.marginTop = "10px";

    }
}

function countdown(duration , count)
{
    if(currentIndex < count)
    {
        let minutes , seconds ;
        countdownInterval = setInterval( () =>{

            minutes = parseInt(duration / 60 );
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes ;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes} : ${seconds}`;

            if(--duration < 0)
            {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        },1000)
    }
}