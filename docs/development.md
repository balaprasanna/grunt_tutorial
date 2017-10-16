# Creating a simple MCQ web application
## Step 1: Start local Project directory
1. Create working directory for project
1. [Project directory] Create subfolders & files. E.g.  
    ```cmd
    C:\..\Project dir>md server
    C:\..\Project dir>md client
    C:\..\Project dir\client>md js
    C:\..\Project dir\client>md css
    C:\..\Project dir\client>md assets
    ```
Assumptions:
* express, nodemon, body-parser and all other server dependencies have been installed successfully
* bower, angular, bootstrap, font-awesome and all other client dependencies have been installed successfully
## Step 2: Edit server app.js
1. Create MCQ data structure and populate with data
    ```
    var multipleChoiceQuestions = [{
            questionId:0,
            question:"Javascript is _________ language.",
            answer1: {label:"Programming", answerValue:1},
            answer2: {label:"Application", answerValue:2},
            answer3: {label:"Scripting", answerValue:3},
            answer4: {label:"None of the above", answerValue:4},
            correctAnswer:3
        },
        {
            questionId:1,
            question:"JavaScript is ______ Side Scripting Language.",
            answer1: {label:"Server", answerValue:1},
            answer2: {label:"ISP", answerValue:2},
            answer3: {label:"Browser", answerValue:3},
            answer4: {label:"None of the above", answerValue:4},
            correctAnswer:3
        },
        ...
    }];
    ```
## Step 3: Edit client app.js
1. Declare new angular app
    ```javascript
    var app = angular.module("mcqApp", []);
    ```
2. Declare new angular app controller
    ```javascript
    app.controller("mcqController", ["$http", mcqController]);
    ```
3. Write the code for the newly-declared controller
    ```javascript
    // describe controller abilities
    function mcqController($http) {
        var self = this;
        ...
    }
    ```
  + Describe data structure to hold MCQ set being sent from server
    ```javascript
    // to hold the question and answer options from server
    self.questionSet = {
    };
    ```
  + Describe data structure to hold user answer to be sent to the server
    ```javascript
    // to hold the user responses to send to the server
    self.finalAnswer = {
        questionId: 0,
        answerValue: "",
        serverMessage: ""
    };
    ```
  + Describe function to prepare current set of question and answer options via `app.get`
    ```javascript
    // to get a new set of question & answer options from the server
    self.initForm = function(){
        $http.get("/mcquestions")
        .then(function(result) {
            console.log(result);
            self.questionSet = result.data;
        }).catch(function(e) {
            console.log(e);
        });
    }
    self.initForm();
    ```
## Step 4: Edit server app.js
1. Write the code to respond to client `app.get` request
    ```javascript
    // serves back request for a new question set
    app.get("/mcquestions", function(req, res) {
        // randomise question to pick
        var x = Math.random() * (6 - 1) + 1;
        var y = Math.floor(x);
        console.log(y);
        // return the randomly-selected question set
        res.json(multipleChoiceQuestions[y-1]);
    });
    ```
## Step 5: Edit index.html
1. Declare `ng-cloak` in <body> to hide angular data-binding display in progress
    ```html
    <body ng-cloak>
    ```
2. Declare `ng-app` to link to newly-declared app in client app.js
    ```html
    <html lang="en" ng-app="mcqApp">
    ```
3. Declare `ng-controller` to link element to newly-created controller
    ```html
    <div ng-controller="mcqController as ctrl" class="col-sm-8 col-lg-4">
        <h1>MCQ Exercise</h1>
        ...
    </div>
    ```
4. Lay out the form, embedding controller values & display placeholders for the MCQ set
  + Use {{ }} to access angular objects
    ```html
    <div class="form-group">
        <label for="question">{{ctrl.questionSet.question}}</label>
    </div>
    <div class="form-group">
        <label for="answer">Answers :</label>
        <br/>
        <input id="answer" name="answer" type="radio" ng-model="ctrl.finalAnswer.answerValue" value="{{ctrl.questionSet.answer1.answerValue}}" /> {{ctrl.questionSet.answer1.label}}
        <br/>
    ```
  + Use `ng-model` to bind form field to angular object field
    ```html
    <input id="answer" name="answer" type="radio" ng-model="ctrl.finalAnswer.answerValue" value="{{ctrl.questionSet.answer2.answerValue}}" /> {{ctrl.questionSet.answer2.label}}
    <br/>
    ```
5. Add `ng-submit` to accept submitted form data and call client app.post
    ```html
    <form ng-submit="ctrl.validateAnswer()">
    ```
## Step 6: Edit client app.js
1. Write code to accept app.post data from index.html
    ```javascript
    self.validateAnswer = function() {
        console.log("Submitting answer for validation...");
        self.finalAnswer.questionId = self.questionSet.questionId;
        ...
    }
    ```
2. Submit received data to server
    ```javascript
    $http.post("/submit", self.finalAnswer)
    ```
## Step 7: Edit server app.js
1. Write the code to respond to client app.post request, and return outcome of answer check
    ```javascript
    // accepts submitted answer, checks if correct & returns status
    app.post("/submit", function(req,res) {
        console.log("Server received: " + JSON.stringify(req.body));
        var submittedAnswer = req.body;
        var expectedAnswer = multipleChoiceQuestions[submittedAnswer.questionId];
        
        if (parseInt(submittedAnswer.answerValue) == expectedAnswer.correctAnswer)
            submittedAnswer.isCorrect = true;
        else
            submittedAnswer.isCorrect = false;
        res.status(200).json(submittedAnswer);
    });
    ```
## Step 8: Edit client app.js
1. Base on received status from server app.post, update bound data `serverMessage`
    ```javascript
    .then (function(result) {
        console.log(result);
        if (result.data.isCorrect) {
            self.finalAnswer.serverMessage = "CORRECT";
        } else {
            self.finalAnswer.serverMessage = "INCORRECT. Try Again";
        }
    }) .catch(function(e) {
        console.log(e);
    });
    ```
## Step 9: Edit index.html
1. Add angular object field {{ ctrl.finalAnswer.serverMessage}} to display final status
    ```html
    <div class="form-group">
        <hr/>
        <input id="submit" name="submit" type="submit" class="btn btn-success" /> {{ ctrl.finalAnswer.serverMessage}}
    </div>
    ```
## Step 10: Run MCQ server app