/**
 * Client side code.
 */
(function () {
    "use strict";
    angular.module("PopQuizApp").controller("PopQuizCtrl", PopQuizCtrl);
    
    PopQuizCtrl.$inject = ["$http"];

    function PopQuizCtrl($http) {
        var self = this; // vm

        self.qnNum = 1;
        self.numQuestions = 0;

        self.quiz = {
            
        };
        console.log("comments..");
        self.finalanswer = {
            id: 0,
            value: "",
            comments: "",
            message: ""
        };

        self.initForm = function () {
            $http.get("/numQuestions")
            .then(function (result) {
                console.log(result);
                console.log(result.data);
                self.numQuestions = result.data;
            }).catch(function (e) {
                console.log(e);
            });

            $http.get("/popquizes")
                .then(function (result) {
                    console.log(result);
                    self.quiz = result.data;
                }).catch(function (e) {
                    console.log(e);
                });
        };

        self.initForm();


        self.submitDisabled = false; //indicator to enable or disable the Submit and Next buttons
        self.showResult = false; //indicator to show the question/answers and the result screen

        self.submitQuiz = function () {
            console.log("submitQuiz !!!");
            self.finalanswer.id = self.quiz.id;
            $http.post("/submit-quiz", self.finalanswer)
                .then(function (result) {
                    console.log(result);
                    if (result.data.isCorrect) {
                        self.finalanswer.message = "It's CORRECT !";
                    } else {
                        self.finalanswer.message = "WRONG !";
                    }

                    //if the following is received from the server,
                    //the client has to then show the End Quiz button
                    if(result.data.endOfQuiz) {
                        console.log("End of quiz, score = " + result.data.score);
                        self.endOfQuiz = true;
                        self.score =  result.data.score;
                    }
                }).catch(function (e) {
                    console.log(e);
                });

            self.submitDisabled = true; //disable the Submit button. 
        };

        //this is the function invoked when the user click on the Next button
        //it is very similar to the initForm function
        //it will use the same endpoint /popquizes to get a question
        //the differences are that it has some additional logic to enable/disable the buttons and display additional info
        self.getNext = function () {
            self.finalanswer.message = ""; //hide the status message
            self.finalanswer.value = ""; //deselect the radio button selection from previous choice
            self.finalanswer.comments = ""; // reset remarks.
            
            self.submitDisabled = false; //enable the Submit button (for the next question)
            $http.get("/popquizes")
            .then(function (result) {
                console.log(result);
                self.quiz = result.data;
                self.qnNum++; //increase the question serial number
                self.finalanswer.value = "";

            }).catch(function (e) {
                console.log(e);
            });
        };

        //to toggle the indicator which will then hide the question/answers screen and show the result screen instead
        self.EndQuiz = function () {
            self.showResult = true;
        }

    }

})();