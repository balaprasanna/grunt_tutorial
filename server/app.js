/**
 * Server side code.
 */
"use strict";
console.log("Starting...");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log(__dirname);
console.log(__dirname + "/../client/");
const NODE_PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/../client/"));


var quizes = require("./quizes.json");

var questions = quizes.slice(); //make a copy of the questions array
var score = 0; //to keep track of the user score

//endpoint to provide information to the client on the total number of questions
app.get("/numQuestions", function (req, res) {
    res.send("" + quizes.length);
});

app.get("/popquizes", function (req, res) {

    //only randomise if there are at least 2 questions in the array
    if (questions.length > 1) {
        shuffle(questions);
    }

    //can only send a question if there is at least one question in the array
    if (questions.length > 0) {
        var question = questions.pop(); //send the last question
        var cloneQuestion = Object.assign({}, question);
        delete cloneQuestion.correctanswer;
        res.json(cloneQuestion);
    }
});

app.post("/submit-quiz", function (req, res) {
    console.log("Received user object " + req.body);
    console.log("Received user object " + JSON.stringify(req.body));
    var quiz = req.body;
    var checking = quizes[quiz.id];
    console.log(checking);
    console.log(checking.correctanswer);
    console.log(quiz.value);
    
    if (checking.correctanswer == parseInt(quiz.value)) {
        console.log("CORRECT !");
        quiz.isCorrect = true;
        score++;
    } else {
        console.log("INCORRECT !");
        quiz.isCorrect = false;
    }

    //check if the user has finished answering all the questions
    //if so, to send an indicator so that the client can show the End Quiz button
    //and to also send the score
    if (questions.length == 0) {
        quiz.endOfQuiz = true;
        quiz.score = score;

        //reset at the server side
        questions = quizes.slice();
        score = 0;
    }
    res.status(200).json(quiz);
});


app.use(function (req, res) {
    res.send("<h1>!!!! Page not found ! ! !</h1>");
});

app.listen(NODE_PORT, function () {
    console.log("Web App started at " + NODE_PORT);
});

//make the app public. In this case, make it available for the testing platform
module.exports = app

// code from https://www.frankmitchell.org/2015/01/fisher-yates/
function shuffle(array) {
    var i = 0
        , j = 0
        , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}