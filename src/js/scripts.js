const $romaji = ['a', 'i', 'w', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko',
    'sa', 'si', 'su', 'se', 'so', 'ta', 'ti', 'tu', 'te', 'to',
    'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'hu', 'he', 'ho',
    'ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo',
    'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wi', 'we', 'wo', 'n'];

var answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var quizType = true; // Hiragana to Romaji
var loggedIn = false;
var finished = false;
var timed = false;


function loginNav() {
    $('#login').toggle();
}

function registerNav() {
    $('#register').toggle();
}

function setType(type) {
    quizType = type;
}

function setTimed() {
    timed = !timed;
}


function checkAnswer(e, questionId) {
    let correctAnswer = $romaji[options[questionId]];
    if (e.value.includes(".png")) {
        correctAnswer = options[questionId];
        answers[questionId] = (e.value.includes(correctAnswer)) ? 1 : 0;
        return;
    }
    answers[questionId] = (e.value === (correctAnswer)) ? 1 : 0;
}

function checkQuestion(id) {
    $('#result_msg' + id).text("Your answer is " + (answers[id] === 1 ? "correct" : "incorrect") + "! Current progress : " + answers.reduce((a, b) => a + b, 0) + "/10");
}

function saveAnswers() {
    var score = answers.reduce((a, b) => a + b, 0);
    var percent = (score / 10) * 100;
    var alternate = 'N/A';
    $.ajax({
        url: 'SaveAnswers.php',
        type: 'post',
        data: {score: percent, time: currentTime != null ? currentTime : alternate},
    });
    getResults();
}

function end() {
    if (loggedIn) {
        saveAnswers();

    }

    answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    back();
    $('#login').hide();
    $('#register').hide();
    $('#result').hide();
    $('#result').empty();
    $('#orText').hide();
    $('#orText1').hide();
    options = [];
    isSelecting = false;
    resetCSS();
    pushError("");

}

function resetCSS() {
    $('img').each(function () {
        $(this).css('background-color', 'white');
    });
    $("#selectd").text("Enter select mode");
}

function submitAnswers() {
    $('#result').show();
    var score = answers.reduce((a, b) => a + b, 0);
    finished = true;
    $('#result').append("<div><h1>You scored " + (score === 0 ? 0 : (score / 10) * 100) + "%" + (timed ? ("  with time of : " + currentTime) : '') + "</h1><button class = 'btn btn-secondary' id = 'end' onclick='end()'>" + (!loggedIn ? 'Continue without saving' : 'Continue') + "</button></div>");
    $('#quiz').hide();
    if (!loggedIn) { // logged in
        $('#login').show()
            .after("<h2 id = 'orText'>OR</h2>")
            .before("<h4 id = 'orText1'>Login or register to save your progress</h4>");
        $('#register').show();
    }
    pauseTimer();
}

function getResults() {
    $('#previous').empty();
    $.ajax({
        url: 'GetResults.php',
        type: 'post',
        success: function (response) {
           $('#previous').append('<h1 style="padding-top:40px;">Previous attempts:</h1>').append(response);
        }
    });
}

function login() {


    let username = $('#uname').val();
    let password = $('#pwd').val();

    if (username != "" && password != "") {
        $.ajax({
            url: 'Login.php',
            type: 'post',
            data: {username: username, password: password},
            success: function (response) {
                var msg = "";
                if (response == 1) {
                    $('#login').hide();
                    loggedIn = true;
                    getResults();
                    $('#loginNav').hide();
                    $('#registerNav').hide();
                    $('#navLabel').text("Logged in as " + username);
                    if (finished) {
                        $('#register').hide();
                        $('#orText').hide();
                        $('#orText1').hide();
                        $("#end").text("Continue");
                    }
                } else {
                    msg = "Invalid username and password!";
                }
                if(msg !== "")alert(msg);
            }
        });
    }
}


function register() {
    let username = $("#reg_uname").val();
    let password = $("#reg_pwd").val();

    if (username != "" && password != "") {
        $.ajax({
            url: 'CreateUser.php',
            type: 'post',
            data: {username: username, password: password},
            success: function (response) {
                $('#register').hide();
            }
        });
    }
}

function createRadioElement(name, checked, label) {
    var radioInput;
    try {
        var radioHtml = '<div class="custom-control custom-radio"><input type="radio" onclick="checkAnswer(this, name)" value = "' + label + '" name="' + name + '"';
        if (checked) {
            radioHtml += ' checked="checked"';
        }
        radioHtml += '/><label style="padding-left: 10px;font-size: 22px;font-weight:500">' + label + '</label></div>';
        radioInput = $('#question' + name).append(radioHtml);
    } catch (err) {
        radioInput = $('#question' + name).append('input');
        radioInput.setAttribute('type', 'radio');
        radioInput.setAttribute('name', name);
        radioInput.setAttribute('value', label);
        if (checked) {
            radioInput.setAttribute('checked', 'checked');
        }
    }
    return radioInput;
}

function back() {
    $('#quiz').empty();
    $('#quizForm').show();
    $('#page').show();
    $('#here_table').show();
    if(!loggedIn) {
        $('#loginNav').show();
        $('#registerNav').show();
    }
    window.scrollTo(0, 0);
    if (timed) resetTimer();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


function getRandomIndex() {
    return Math.floor((Math.random() * 47));
}

var startTime;
var updatedTime;
var difference;
var tInterval;
var savedTime;
var paused = 0;
var running = 0;
var currentTime;

function startTimer() {
    if (!running) {
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1);
        paused = 0;
        running = 1;
    }
}

function pauseTimer() {
    if (!difference) {
    } else if (!paused) {
        clearInterval(tInterval);
        savedTime = difference;
        paused = 1;
        running = 0;
    } else {
        startTimer();
    }
}

function resetTimer() {
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    paused = 0;
    running = 0;

}

function getShowTime() {
    updatedTime = new Date().getTime();
    if (savedTime) {
        difference = (updatedTime - startTime) + savedTime;
    } else {
        difference = updatedTime - startTime;
    }
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    let element = document.getElementById("demo");
    currentTime = hours + ':' + minutes + ':' + seconds;
    element.innerHTML = hours + ':' + minutes + ':' + seconds;
}


function generateQuiz(b, options) {
    window.scrollTo(0, 0);
    $('#loginNav').hide();
    $('#registerNav').hide();
    $('#quiz').show();
    if (timed) startTimer();
    $('#quiz').append('<h1>QUIZ    </h1><h1 id = "demo"></h1>');
    shuffleArray(options);
    for (var i = 0; i < 10; i++) {
        $('#quiz').append('<div style = "padding-top: 20px;margin-bottom: 20px;min-width:600px;" class = "container" id = "question' + i + '"></div>');

        let src = './img/letters/' + options[i] + ".png"; //Set the src attribute (imageFiles[i] is the current filename in the loop)
        let image1 = b ? "<img src = '" + src + "' id = 'img" + i + "' style = 'width:40px;height:40px;'/>" : $romaji[options[i]];

        $('#question' + i).append('<h3>Question ' + i + ': What is the ' + (b ? 'Hirigana' : 'Romaji') + ' equivelent of ' + image1 + '<h3>');
        let answers = [$romaji[options[i]], $romaji[getRandomIndex()], $romaji[getRandomIndex()], $romaji[getRandomIndex()]];
        if (!b) {
            let src = './img/letters/' + options[i] + ".png"; //Set the src attribute (imageFiles[i] is the current filename in the loop)
            let image1 = "<img src = '" + src + "' id = 'img" + i + "' style = 'width:40px;height:40px;'/>";
            answers[0] = image1;
            for (let k = 1; k < 4; k++) {
                src = './img/letters/' + getRandomIndex() + ".png"; //Set the src attribute (imageFiles[i] is the current filename in the loop)
                image1 = "<img src = '" + src + "' id = 'img" + i + "' style = 'width:40px;height:40px;'/>";
                answers[k] = image1;
            }
        }
        shuffleArray(answers);
        $('#question' + i).append('<p id = "result_msg' + i + '"></p>');
        for (let j = 0; j < 4; j++) {
            createRadioElement(i, "true", answers[j]);
        }
        $('#question' + i).append('<button class = "btn btn-dark" style = "margin-bottom: 20px;" onclick ="checkQuestion(' + i + ')">Check answer</button></div>');

    }
    $('#quiz').append('<div><button class = "btn btn-dark" style = "margin-bottom: 15px" onclick ="submitAnswers()">Submit answers</button>')
        .append('<button class = "btn btn-dark" onclick ="back()">Back</button></div>');
    $('#quizForm').hide();
    $('#page').hide();
    $('#here_table').hide();
    $('#login').hide();
    $('#register').hide();
}