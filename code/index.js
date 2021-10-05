// כללי
var SUBJECTS_TITLES;
const AMOUNT_OF_TOTAL_QUESTIONS = 20;
var blurAmount = "10px";
//
var selectedSubjects = [];
var firstName;
var lastName;

// עמוד התרגול
const CARD_NUMS = ["first", "second", "third"];
const AMOUNT_OF_TIME_TO_QUESTION = 60;
var count = 0;
var currentQuestion = 0;
var practiceSeconds = AMOUNT_OF_TIME_TO_QUESTION;
var points = 0;
var timer;
var isComplete = false;
var avgTimeForQusetion = 0;
var sumTimeForQeustions = 0;
var isPressedHalfHalf = false;
var QUESTIONS = [];
var currCardCount;

// עמוד מבחן
var EXAM_SECONDS;
var EXAM_MINUTS;
var currentQuestionExam = 0;
var timerExam;
var examSeconds;
var examMinutes;
var totalTimeExam;
var answeredQuestions = 0;

// עמוד למידה
var currentCard = 0;
var currSubjCount = -1;
 // התת נושא שבמרכז העמוד
var midElement;


/** @type {(boolean|number)[]} */
var examAnswers = [];

// פונקציית הטעינה של כל הלומדה
window.addEventListener("load", function () {
    SUBJECTS_TITLES = Object.keys(DATA);

    // כותרת ראשית ללומדה
    addTitle();
    // כותרת נושא הלומדה
    function addTitle() {
        document.querySelector(".page.opening .title").innerHTML = TITLE;
        document.querySelector(".page.learning .title").innerHTML = TITLE;
    }


    let fullScreen = El("div", {cls: "full-screen"});
    document.querySelector(".page.opening").before(fullScreen);
    fullScreen.addEventListener("click", homePage);

    // מעבר בין עמוד הבית לעמוד הלמידה
    let scrollingIcon = El("img", {attributes: {class:"scrolling_icon", src: "../assets/images/opening/scrolling_icon.svg"}});
    document.querySelector(".page.opening .container-scrolling_icon").append(scrollingIcon); 
    // הפעלה של האנימציה בלחיצה
    document.querySelector(".page.opening  .expand").style.transition = "all 1s ease";

});

// מעבר לדף הבית
/**
 * 
 * @param {Event} event 
 */
function homePage(event) {
    document.querySelector(".page.home").classList.add("active");
    document.querySelector(".full-screen").remove();
    document.querySelector(".main").removeEventListener("scroll", homePage, false);
    
    document.querySelector(".main").style.overflow = "hidden";
    document.querySelector(".page.home .books").style.display = "block";
    document.querySelector(".page.home .textArea").style.display = "block";
    document.querySelector(".page.opening").classList.add("scrolled");
    
    document.querySelector(".page.home .about").style.display = "block";
    document.querySelector(".page.home .about").addEventListener("click", aboutPage);
    
    let fullScreen = El("div", {cls: "full-screen"});
    document.querySelector(".page.opening").before(fullScreen);
    // מעבר לדף הבית
    setTimeout(function () {
        document.querySelector(".full-screen").addEventListener("click", ()=> {
            document.querySelector(".full-screen").remove();
            document.querySelector(".page.opening").classList.remove("active");
            document.querySelector(".page.home").classList.remove("active");
            document.querySelector(".page.learning.subjects").classList.add("active");
            learningSubjectsPage();
        });
    }, 1000);
}


// מעבר לאודות
function aboutPage(event) {
    document.querySelector(".full-screen").style.visibility = "hidden";
    document.querySelector(".page.opening").classList.remove("active");
    document.querySelector(".page.home").classList.remove("active");
    document.querySelector(".page.about").classList.add("active");
    // מעבר לדף הבית
    document.querySelector(".page.about .back-btn").addEventListener("click", () => {
        document.querySelector(".full-screen").style.visibility = "visible";
        document.querySelector(".page.opening").classList.add("active");
        document.querySelector(".page.home").classList.add("active");
        document.querySelector(".page.about").classList.remove("active");
    });
}

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// אתחול עמוד הנושאים ללמידה
function learningSubjectsPage() {
    document.querySelector(".page.opening").classList.remove("active");
    document.querySelector(".page.home").classList.remove("active");
    document.querySelector(".page.learning.subjects").classList.add("active"); //// מעכשיו 27/4
    //  הוספת כפתור חזרה למסך נושאי הלמידה
    let backBtn =
    El("img", {
        attributes: { class: "back-btn", src: "../assets/images/general/back_btn.svg" },
        listeners: {
            click: function () {
                document.querySelector(".page.learning.subjects  .cards-container").innerHTML = "";
                document.querySelector(".page.learning.subjects").classList.remove("active");
                document.querySelector(".page.learning.subjects .back-btn").remove();
                document.querySelector(".page.opening").classList.add("active");
                document.querySelector(".page.home").classList.add("active");
                let fullScreen = El("div", {cls: "full-screen"});
                document.querySelector(".page.opening").before(fullScreen);
                // מעבר לדף הבית
                document.querySelector(".full-screen").addEventListener("click", ()=> {
                    document.querySelector(".full-screen").remove();
                    document.querySelector(".page.opening").classList.remove("active");
                    document.querySelector(".page.home").classList.remove("active");
                    document.querySelector(".page.learning.subjects").classList.add("active");
                    learningSubjectsPage();
                });
            }
        }
    });
    document.querySelector(".page.learning.subjects").append(backBtn);


    // יוצר את הכרטיסיות של נושאי הלימוד
    for (let subject of SUBJECTS_TITLES) {
        createStudyCards(subject);
    }

    document.querySelector(".page.learning.subjects .practice-btn").addEventListener("click", beforePractice);

    document.querySelector(".page.learning.subjects .exam-btn").addEventListener("click", beforeExam);

}

// יצירת קלפים ללמידה
function createStudyCards(currentSubject) {
    let card =
        El("div", { cls: "learningCard" },
            El("img", { attributes: { src: DATA[currentSubject].icon, class: "icon" } },
                // El("img", { attributes: { src: DATA[currentSubject].icon } })
            ),
            El("div", { cls: "subject" }, currentSubject)
        );
    document.querySelector(".page.learning.subjects .cards-container").append(card);
    card.addEventListener("click", () => {
        document.querySelector(".page.learning.subjects").classList.remove("active");
        document.querySelector(".page.learning.content").classList.add("active");
        subjectLearningPage(currentSubject);
    });
}

function beforePractice() {
    document.querySelector(".page.learning.subjects .title").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.subjects .sub-title").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.subjects .cards-container").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.subjects .back-btn").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.subjects .buttons").style.filter = `blur(${blurAmount})`;

    let popup =
        El("div", { cls: "dark" },
            El("div", { cls: "beforePractice-popup" },
                El("img", {
                    attributes: {
                        src: "../assets/images/general/close_btn.svg", class: "close-btn"
                    }
                }),
                // כותרת
                El("div", { cls: "title-popup" }, "בחר נושאי תרגול"),
                El("div", { cls: "select-everything" },
                    El("img", { attributes: { class: "checkPlace-big", src: "../assets/images/learning/choosePractice_popup/nonSelectSMALL.svg" } }),
                    El("div", { cls: "" }, "בחר הכל")
                ),
                El("div", { cls: "subjects-container" },
                    El("div", { cls: "group-line" }),
                    El("div", { cls: "subjects" })
                ),
                El("div", { cls: "beforePractice-instruction-container" },
                    El("div", {},
                        El("img", { attributes: { class: "icon2", src: "../assets/images/practice/beforePractice_popup/timer_icon.svg" } }),
                        El("div", { cls: "text" },
                            El("b", {}, "דקה"),
                            El("br", {}),
                            "לשאלה"
                        ),
                    ),
                    El("div", {},
                        El("img", { attributes: { class: "icon1", src: "../assets/images/practice/beforePractice_popup/slide_icon.svg" } }),
                        El("div", { cls: "text" },
                            El("b", { cls: "italic" }, " הקליקו"),
                            El("br", {}),
                            "למעבר"
                        ),
                    ),
                    El("div", {},
                        El("img", { attributes: { class: "icon1", src: "../assets/images/practice/beforePractice_popup/blow_icon.svg" } }),
                        El("div", { cls: "text" },
                            El("b", {}, "תרגעו"),
                            El("br", {}),
                            "תנשמו"
                        ),

                    ),
                ),
                El("img", { attributes: { class: "practiceBTN-popup", src: "../assets/images/learning/choosePractice_popup/choosePractice_btn.svg" } })
            )
        );
    document.querySelector(".page.learning.subjects").append(popup);

    // מערך שבו רשום המיקום של הנושא לפי סדר ההופעה שלו בג'ייסון
    selectedSubjects = [];
    // איפוס המערך של הנושאים הנבחרים
    for (let i = 0; i < SUBJECTS_TITLES.length; i++) {
        selectedSubjects[i] = false;
    }
    let selectAll = document.querySelector(".page.learning.subjects .select-everything");
    // מאזין לחיצה לכפתור בחירת כל הנושאים
    selectAll.addEventListener("click", (e) => {
        // אם הכפתור היה לחוץ 
        if (selectAll.classList.contains("checked")) {
            document.querySelectorAll(".page.learning.subjects .subject-popup, .page.learning.subjects .select-everything").forEach((checkBox, i) => {
                checkBox.querySelector("img").src = "../assets/images/learning/choosePractice_popup/nonSelectSMALL.svg";
                checkBox.classList.remove("checked-subjects");
            });
            selectAll.classList.remove("checked");
            for (let i = 0; i < SUBJECTS_TITLES.length; i++) {
                selectedSubjects[i] = false;
            }

        }
        // הכפתור לא היה לחוץ, ולכן כל נושאי הלמידה יסומנו כעת
        else {
            document.querySelectorAll(".page.learning.subjects .subject-popup, .page.learning.subjects .select-everything").forEach((checkBox, i) => {
                checkBox.querySelector("img").src = "../assets/images/learning/choosePractice_popup/selectedSMALL.svg";
                checkBox.classList.add("checked-subjects");
            });
            selectAll.classList.add("checked");
            for (let i = 0; i < SUBJECTS_TITLES.length; i++) {
                selectedSubjects[i] = true;
            }
        }
        // במידה והמחלקה קיימת ויש ערך מסומן להתחלת התרגול - הכפתור תרגול יהיה לחיץ
        let isChecked = document.querySelector(".page.learning.subjects .beforePractice-popup .checked-subjects");
        document.querySelector(".page.learning.subjects .practiceBTN-popup").classList.toggle("avalible", isChecked);

    });

    // הוספת כל נושאי הלמידה האפשריים לתרגול
    for (let i = 0; i < SUBJECTS_TITLES.length; i++) {
        // לעבור על הנושאים במערך הנושאים ולהביא את הכותרת של כל נושא
        let subject =
            El("div", { cls: "subject-popup" },
                El("img", { attributes: { class: "checkPlace", src: "../assets/images/learning/choosePractice_popup/nonSelectSMALL.svg" } }),
                El("div", { attributes: {} }, SUBJECTS_TITLES[i])
            );
        document.querySelector(".page.learning.subjects .subjects").append(subject);

        // מאזין לחיצה לנושא אחד
        subject.addEventListener("click", () => {
            // אם הנושא הנלחץ כבר היה לחוץ
            if (subject.classList.contains("checked-subjects")) {
                subject.querySelector("img").src = "../assets/images/learning/choosePractice_popup/nonSelectSMALL.svg";
                subject.classList.remove("checked-subjects");
                selectedSubjects[i] = false;
                selectAll.querySelector("img").src = "../assets/images/learning/choosePractice_popup/nonSelectSMALL.svg";
                selectAll.classList.remove("checked-subjects");
                selectAll.classList.remove("checked");
            }
            // הנושא הנבחר לא היה לחוץ ולכן עכשיו יסומן
            else {
                selectedSubjects[i] = true;
                subject.querySelector("img").src = "../assets/images/learning/choosePractice_popup/selectedSMALL.svg";
                subject.classList.add("checked-subjects");
                let isNotChecked = document.querySelector(".page.learning.subjects .subject-popup:not(.checked-subjects)");
                selectAll.classList.toggle("checked-subjects", !isNotChecked);
                selectAll.classList.toggle("checked", !isNotChecked);
                if (!isNotChecked)
                    selectAll.querySelector("img").src = "../assets/images/learning/choosePractice_popup/selectedSMALL.svg";

            }
            // במידה והמחלקה קיימת ויש ערך מסומן להתחלת התרגול - הכפתור תרגול יהיה לחיץ
            let isChecked = document.querySelector(".page.learning.subjects .beforePractice-popup .checked-subjects");
            document.querySelector(".page.learning.subjects .practiceBTN-popup").classList.toggle("avalible", isChecked);
        });
    }

    // כפתור סגירה של הפופאפ
    document.querySelector(".page .beforePractice-popup .close-btn").addEventListener("click", () => {
        document.querySelector(".page.learning.subjects .title").style.filter = "unset";
        document.querySelector(".page.learning.subjects .sub-title").style.filter = "unset";
        document.querySelector(".page.learning.subjects .cards-container").style.filter = "unset";
        document.querySelector(".page.learning.subjects .back-btn").style.filter = "unset";
        document.querySelector(".page.learning.subjects .buttons").style.filter = "unset";
        document.querySelector(".page.learning.subjects .dark").remove();
    });

    // כפתור מעבר לתרגול מהפופאפ
    document.querySelector(".page .practiceBTN-popup").addEventListener("click", () => {
        document.querySelector(".page.learning.subjects .title").style.filter = "unset";
        document.querySelector(".page.learning.subjects .sub-title").style.filter = "unset";
        document.querySelector(".page.learning.subjects .cards-container").style.filter = "unset";
        document.querySelector(".page.learning.subjects .back-btn").style.filter = "unset";
        document.querySelector(".page.learning.subjects .buttons").style.filter = "unset";
        document.querySelector(".page.learning.subjects .dark").remove();
        document.querySelector(".page.learning.subjects").classList.remove("active");
        document.querySelector(".page.practice").classList.add("active");
        practicePage();
    });

}

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

function questionsToPractice() {
    let selectedQuestions = [];

    let subjects = SUBJECTS_TITLES.filter((_, i) => selectedSubjects[i]);

    // מקסימום כמות השאלות לכל נושא
    let maxQuestionAmountForTopic = AMOUNT_OF_TOTAL_QUESTIONS / subjects.length;
    // בוחר את השאלות מכל נושא
    for (let subject of subjects) {
        let subjectData = DATA[subject];
        // מספר השאלות לנושא
        let subjectQuestions = subjectData.questionsPractice.length;
        // בוחר את מספר השאלות
        let questionCount = Math.min(subjectQuestions, Math.max(Math.floor(maxQuestionAmountForTopic), 1));
        // מסדר באופן רנדומלי את השאלות ממערך הנתונים
        let shuffledQuestions = shuffle(subjectData.questionsPractice.slice());
        // בוחר את האיקס שאלות הראשונות
        selectedQuestions.push(...shuffledQuestions.slice(0, questionCount));
        if (selectedQuestions.length === AMOUNT_OF_TOTAL_QUESTIONS) break;
    }
    return selectedQuestions;
}

// מעבר לדף התרגול ואתחולו
function practicePage(event) {
    // מערך השאלות הרלוונטיות לנושאים הנבחרו בכמות המקסימלית האפשרית
    QUESTIONS = questionsToPractice();

    shuffle(QUESTIONS);

    // איפוס מיקום השאלה הנוכחית
    currentQuestion = 0;
    currCardCount = 1;

    // איפוס ניקוד
    points = 0;

    // איפוס הבר הכחול למעלה
    document.querySelector(".page.practice .right-answers > .points").innerHTML = 0;
    document.querySelector(".page.practice .sum-answers > .points").innerHTML = QUESTIONS.length;

    // אתחול 2 הכרטיסים הראשונים על המסך
    for (let i = 0; i < 2; i++) {
        // השאלה היא שאלת נכון לא נכון
        if (QUESTIONS[i].type === "binary") {
            createBinaryCard(i);
            // מוסיף לכל התשובות מאזין לחיצה
            if (i === 0) {
                document.querySelector(".page.practice .first-question .right-ans").addEventListener("click", e => checkAnswerBinary("right", e));
                document.querySelector(".page.practice .first-question .wrong-ans").addEventListener("click", e => checkAnswerBinary("wrong", e));
            }

        }
        // השאלה היא שאלה אמריקאית
        else {
            createMultipleCard(i);

            if (i === 0) {
                // מוסיף לכל התשובות מאזין לחיצה
                let selectedAns = document.querySelectorAll(".page.practice .first-question .answer-container");
                for (let countAns = 0; countAns < 4; countAns++) {
                    selectedAns[countAns].addEventListener("click", checkAnswerMultiple);
                }
            }
        }

    }

    
    // מוסיף לכרטיסייה הראשונה את מספר הכרטיסייה הנוכחית
    document.querySelector(".page.practice .first-question .curr-question > .curr-ques-text").innerHTML = currCardCount;

    // התחלת הספירה לאחור
    timer = setInterval(startTimer, 1000);

    // מאזין לחיצה לכפתור חצי חצי
    document.querySelector(".page.practice .half-half").addEventListener("click", activateHalfHalfBTN);
    // בודק האם להפעיל את כפתור החצי חצי
    halfHalfBTN_mode();

    // מאזין לחיצה לכפתור גלה לי
    document.querySelector(".page.practice .show-answer").addEventListener("click", showAnswer);


    //  הוספת כפתור חזרה למסך הבית
    let backBtn =
        El("img", {
            attributes: { class: "back-btn", src: "../assets/images/general/back_btn.svg" },
            listeners: {
                click: function () {
                    document.querySelector(".page.practice").classList.remove("active");
                    document.querySelector(".page.learning.subjects").classList.add("active");
                    resetPrecticePage();
                }
            }
        });
    document.querySelector(".page.practice").append(backBtn);
}

function halfHalfBTN_mode() {

    // האם זו לא הכרטסייה האחרונה
    if (currentQuestion >= QUESTIONS.length) {
        return;
    }

    // האם זה נכון לא נכון
    if (QUESTIONS[currentQuestion].type === "binary") {
        document.querySelector(".page.practice .half-half").style.opacity = "0.5";
        document.querySelector(".page.practice .half-half").style.pointerEvents = "none";
    }
    // אמריקאי
    else {
        document.querySelector(".page.practice .half-half").style.pointerEvents = "all";
        document.querySelector(".page.practice .half-half").style.opacity = "1";
        isPressedHalfHalf = false;
    }
}

// הפונקציה יוצרת קלף של שאלות אמריקאיות
function createMultipleCard(i = 2) {
    let card =
        El("div", { classes: [`${CARD_NUMS[i]}-question`, "card", "multiple"] }, //אבא
            El("div", { cls: "timer" },                  // ילד
                El("div", { cls: "timeLeft" },           //ילד של ילד
                    "1:00"
                )
            ),
            // תמונה של הקלף
            El("img", { attributes: { src: "../assets/images/exam/exam2.svg" } }),

            El("div", { cls: "question-text" },
                // השאלה
                El("div", { cls: "question" }, QUESTIONS[currentQuestion + i].question),
                // התשובות
                El("div", { classes: ["answer-container", "ans1"] },
                    El("img", { attributes: { src: "../assets/images/general/chooseQuestion_btn.svg" } }),
                    El("div", { cls: "ans" }, QUESTIONS[currentQuestion + i].ans1)
                ),
                El("div", { classes: ["answer-container", "ans2"] },
                    El("img", { attributes: { src: "../assets/images/general/chooseQuestion_btn.svg" } }),
                    El("div", { cls: "ans" }, QUESTIONS[currentQuestion + i].ans2)
                ),
                El("div", { classes: ["answer-container", "ans3"] },
                    El("img", { attributes: { src: "../assets/images/general/chooseQuestion_btn.svg" } }),
                    El("div", { cls: "ans" }, QUESTIONS[currentQuestion + i].ans3)
                ),
                El("div", { classes: ["answer-container", "ans4"] },
                    El("img", { attributes: { src: "../assets/images/general/chooseQuestion_btn.svg" } }),
                    El("div", { cls: "ans" }, QUESTIONS[currentQuestion + i].ans4)
                )
            ),
            El("div", { cls: "next-btn" },
                El("img", { attributes: { src: "../assets/images/practice/nextQuestion_btn.svg" } }),
                El("div", {cls: "curr-question"},
                    El("div", {cls:"curr-ques-text"}), 
                    "/",
                    El("div", {}, QUESTIONS.length),
                )
            )
        );
    document.querySelector(".container-questions").append(card);
}

// יוצרת קלף של שאלות נכון לא נכון
function createBinaryCard(i = 2) {
    let card =
        El("div", { classes: [`${CARD_NUMS[i]}-question`, "card", "binary"] }, //אבא
            El("div", { cls: "timer" },                  // ילד
                El("div", { cls: "timeLeft" },           //ילד של ילד
                    "1:00"
                )
            ),
            // תמונה של הקלף
            El("img", { attributes: { src: "../assets/images/exam/exam2.svg" } }),
            // השאלה
            El("div", { cls: "question-text" },
                El("div", { cls: "question" }, QUESTIONS[currentQuestion + i].sentence),
                // התשובות
                El("div", { cls: "ans-container" },
                    El("img", { attributes: { src: "../assets/images/general/wrong_btn.svg" }, cls: "wrong-ans" }), // לברר עם פלג אם ככה כותבים את הקלאס בנוסף לקישור תמונה
                    El("img", { attributes: { src: "../assets/images/general/right_btn.svg" }, cls: "right-ans" }),
                ),
            ),
            El("div", { cls: "next-btn" },
                El("img", { attributes: { src: "../assets/images/practice/nextQuestion_btn.svg" } }),
                El("div", {cls: "curr-question"},
                    El("div", {cls:"curr-ques-text"}), 
                    "/",
                    El("div", {}, QUESTIONS.length),
                )
            )
        );
    document.querySelector(".container-questions").append(card);
}

// טיימר שסופר דקה לכל שאלה
function startTimer() {
    // כדי שהשעון יראה קודם 1:00 ולא 60
    if (practiceSeconds < AMOUNT_OF_TIME_TO_QUESTION) {
        document.querySelector(".page.practice .first-question .timeLeft").innerHTML = practiceSeconds;
    }

    // ספירה לאחור
    if (practiceSeconds > 0) {
        practiceSeconds--;
    }
    // הזמן נגמר!
    else {
        clearInterval(startTimer);
        timeOver("practice");
    }
}

// (אמריקאי) הפונקציה בודקת אם התשובה שנבחרה אכן נכונה
function checkAnswerMultiple(event) {
    if (isComplete) return;
    document.querySelector(".page.practice .first-question .next-btn > img").addEventListener("click", nextQuestionPractice);
    document.querySelector(".page.practice .first-question .next-btn > img").style.opacity = "1";
    clearInterval(timer);

    event.target.querySelector("img").src = "../assets/images/general/choosenQuestion.svg";
    let correctAns = QUESTIONS[currentQuestion].correctAns;

    // האם התשובה הנלחצת היא התשובה הנכונה
    if (event.target.classList.contains(`${correctAns}`)) {
        document.querySelector(".page.practice .answer-container." + correctAns + "> .ans").style.borderBottom = "2px solid rgb(44, 191, 55)"; //green
        document.querySelector(".page.practice .answer-container." + correctAns + "> .ans").style.paddingBottom = "2%"; //
        points++;
        document.querySelector(".points").innerHTML = points;
    }
    // התשובה הנלחצת אינה נכונה
    else {
        document.querySelector(".page.practice .answer-container." + correctAns + "> .ans").style.borderBottom = "2px solid rgb(44, 191, 55)"; //green
        document.querySelector(".page.practice .answer-container." + correctAns + "> .ans").style.paddingBottom = "2%"; //
        event.target.querySelector(".ans").style.borderBottom = "2px solid rgb(277, 58, 78)"; //red
        event.target.querySelector(".ans").style.paddingBottom = "2%"; //

    }
    isComplete = true;
}

// הפונקציה בודקת אם התשובה שנבחרה אכן נכונה (נכון לא נכון)
function checkAnswerBinary(selectedAnswer, event) {
    if (isComplete) return;
    document.querySelector(".page.practice .first-question .next-btn > img").addEventListener("click", nextQuestionPractice);
    document.querySelector(".page.practice .first-question .next-btn > img").style.opacity = "1";
    clearInterval(timer);

    // משנה את התמונה לתמונה שנבחרה
    if (selectedAnswer === "right") {
        event.target.src = "../assets/images/general/rightSelected_btn.svg";
    }
    else {
        event.target.src = "../assets/images/general/wrongSelected_btn.svg";
    }
    // בודק אם התשובה נכונה
    if (QUESTIONS[currentQuestion].trueOrFalse && selectedAnswer === "right" ||
        !QUESTIONS[currentQuestion].trueOrFalse && selectedAnswer === "wrong") {
        // green line
        let greenLine = El("img", { attributes: { src: "../assets/images/general/rightAnswer.svg" }, cls: "line" });/////////////
        document.querySelector(".question").after(greenLine);
        points++;
        document.querySelector(".points").innerHTML = points;
    }
    else {
        // red line
        let redLine = El("img", { attributes: { src: "../assets/images/general/wrongAnswer.svg" }, cls: "line" });/////////////
        document.querySelector(".question").after(redLine);
    }
    isComplete = true;
}

// הפונקציה מעבירה לשאלה הבאה
function nextQuestionPractice() {
    // 
    currCardCount++;

    // סוכם את כל השניות לכל שאלה
    sumTimeForQeustions = sumTimeForQeustions + (AMOUNT_OF_TIME_TO_QUESTION - practiceSeconds);

    clearInterval(timer);
    // למקרה שזה לא 2 הכרטיסיות האחרונות
    if (currentQuestion + 2 < QUESTIONS.length) {
        if (QUESTIONS[currentQuestion + 2].type === "binary") {
            createBinaryCard();
        }
        else {
            createMultipleCard();
        }

        // מוסיף לכרטיסייה האחורית את מספר הכרטיסייה הנוכחית
        document.querySelector(".page.practice .second-question .curr-question > .curr-ques-text").innerHTML = currCardCount;

        document.querySelector(".page.practice .first-question").classList.add("transition");
        let firstCard = document.querySelector(".page.practice .transition");
        firstCard.style.transform = "translateX(108vw)";
        firstCard.style.transition = "transform 0.7s ease";
        firstCard.style.position = "absolute";

        setTimeout(function () {
            firstCard.remove();
            firstCard.style.transition = "unset";
            firstCard.style.transform = "unset";
            firstCard.style.position = "unset";
            addEventListenersPractice();
        }, 700);

        document.querySelector(".page.practice .second-question").classList.add("first-question");
        document.querySelector(".page.practice .second-question").style.transition = "transform 0.7s ease";
        document.querySelector(".page.practice .second-question").classList.remove("second-question");

        document.querySelector(".page.practice .third-question").classList.add("second-question");
        document.querySelector(".page.practice .second-question").classList.remove("third-question");

        practiceSeconds = AMOUNT_OF_TIME_TO_QUESTION;
        timer = setInterval(startTimer, 1000);
        isComplete = false;
    }
    // 2 הכרטיסיות האחרונות
    else if (currentQuestion + 2 === QUESTIONS.length) {
        // מוסיף לכרטיסייה האחורית את מספר הכרטיסייה הנוכחית
        document.querySelector(".page.practice .second-question .curr-question > .curr-ques-text").innerHTML = currCardCount;

        document.querySelector(".page.practice .first-question").style.transform = "translateX(108vw)";
        document.querySelector(".page.practice .first-question").style.transition = "all 0.7s ease";
        document.querySelector(".page.practice .first-question").style.position = "absolute";
        setTimeout(function () {
            document.querySelector(".page.practice .first-question").remove();
            document.querySelector(".page.practice .first-question").style.transform = "unset";
            document.querySelector(".page.practice .first-question").style.transition = "unset";
            document.querySelector(".page.practice .first-question").style.position = "unset";
            addEventListenersPractice();
        }, 700);

        document.querySelector(".page.practice .second-question").style.transition = "all 0.7s ease";
        document.querySelector(".page.practice .second-question").classList.add("first-question");
        document.querySelector(".page.practice .second-question").classList.remove("second-question");

        practiceSeconds = AMOUNT_OF_TIME_TO_QUESTION;
        timer = setInterval(startTimer, 1000);
        isComplete = false;

    }
    // הכרטיסייה האחרונה
    else if (currentQuestion + 1 === QUESTIONS.length) {
        document.querySelector(".page.practice .container-questions").style.display = "none";
        document.querySelector(".page.practice .buttons").style.display = "none";
        endPractice();
    }
    currentQuestion++;
    
    // בודק האם להפעיל את כפתור החצי חצי
    halfHalfBTN_mode();
    document.querySelector(".page.practice .first-question .next-btn > img").removeEventListener("click", nextQuestionPractice);
}

// הפונקציה מוסיפה מאזיני לחיצה לתשובות
function addEventListenersPractice() {
    // נכון לא נכון
    if (QUESTIONS[currentQuestion].type === "binary") {
        document.querySelector(".page.practice .first-question .right-ans").addEventListener("click", e => checkAnswerBinary("right", e));
        document.querySelector(".page.practice .first-question .wrong-ans").addEventListener("click", e => checkAnswerBinary("wrong", e));
    }
    // אמריקאי
    else {
        // מוסיף לכל התשובות מאזין לחיצה
        let selectedAns = document.querySelectorAll(".page.practice .first-question .answer-container");
        for (let countAns = 0; countAns < 4; countAns++) {
            selectedAns[countAns].addEventListener("click", checkAnswerMultiple);
        }
    }
}

// מוסיף פופאפ סיום עם סיכום התוצאות
function endPractice() {
    document.querySelector(".page.practice .title").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.practice .score").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.practice .back-btn").style.filter = `blur(${blurAmount})`;

    avgTimeForQusetion = sumTimeForQeustions / QUESTIONS.length;
    avgTimeForQusetion = avgTimeForQusetion.toFixed(2);

    let img, isPassTitle, isPassSubTitle;
    // האם כמות התשובות הנכונות גדולה מחצי מהשאלות
    if (points > QUESTIONS.length / 2) {
        isPassTitle = "כל הכבוד!";
        isPassSubTitle = "עברת את התרגול בהצלחה";
        img = "../assets/images/general/finish_popup/check_icon.svg"
    }
    else {
        isPassTitle = "אוי... לא נורא";
        isPassSubTitle = "בהצלחה בפעם הבאה...";
        img = "../assets/images/general/finish_popup/x_icon.svg"
    }

    let finishPopup =
        El("div", { cls: "dark" },
            // כל הקלף
            El("div", { cls: "end-practice" },
                El("img", { attributes: { src: "../assets/images/general/close_btn.svg", class: "close-btn" } }),
                // כותרות
                El("div", { cls: "title-popup" }, isPassTitle),
                El("div", { cls: "popup-sub-titles" },
                    El("div", { cls: "text1-popup" }, isPassSubTitle),
                    El("div", { cls: "text2-popup" }, "הנה כמה נתונים שיעזרו לך"),
                ),
                // בלוק 1
                El("div", { cls: "grey-line" }),
                El("div", { cls: "container-resultes" },
                    El("div", { cls: "summery-titles" },
                        El("div", { cls: "titleAndIcon-container" },
                            El("div", {},
                                points + " " + "תשובות נכונות"
                            ),
                            El("img", { attributes: { src: img, class: "checkIcon-btn" } }),
                        ),
                        "מתוך " + QUESTIONS.length + " שאלות",
                    ),
                    El("div", { cls: "progress-bar-container" },
                        El("div", { cls: "progress-bar-right-answers" })
                    ),
                ),
                // בלוק 2 
                El("div", { cls: "grey-line" }),
                El("div", { cls: "container-resultes" },
                    El("div", { cls: "summery-titles" },
                        El("div", { cls: "titleAndIcon-container" },
                            El("div", {},
                                avgTimeForQusetion + " שניות"
                            ),
                            El("img", { attributes: { src: "../assets/images/general/finish_popup/timer_icon.svg", class: "timeIcon-btn" } }),
                        ),
                        "ממוצע לשאלה",
                    ),
                    El("div", { cls: "progress-bar-container" },
                        El("div", { cls: "progress-bar-time" })
                    ),
                ),

                El("div", { cls: "grey-line" }),
                El("img", { attributes: { src: "../assets/images/general/finish_popup/home_btn.svg", class: "backToHome-btn" } })
            )
        );

    document.querySelector(".page.practice").append(finishPopup);
    document.querySelector(".page.practice .progress-bar-right-answers").style.width = points / QUESTIONS.length * 100 + "%";
    document.querySelector(".page.practice .progress-bar-time").style.width = avgTimeForQusetion / AMOUNT_OF_TIME_TO_QUESTION * 100 + "%";

    // מעבר לדף הבית בלחיצה על הכפתור
    document.querySelector(".page.practice .backToHome-btn").addEventListener("click", () => {
        document.querySelector(".page.practice").classList.remove("active");
        document.querySelector(".page.learning.subjects").classList.add("active");
        resetPrecticePage(true);
    });
    // מעבר לדף הבית בלחיצה על הכפתור
    document.querySelector(".page.practice .close-btn").addEventListener("click", () => {
        document.querySelector(".page.practice").classList.remove("active");
        document.querySelector(".page.learning.subjects").classList.add("active");
        resetPrecticePage(true);
    });
}

// הפונקציה מאתחלת את מסך התרגול ומקבלת ערך "אמת" אם התרגול נערך עד הסוף ובמידה ולא תקבל את הערך "שקר".
function resetPrecticePage(finishPractice = false) {
    practiceSeconds = AMOUNT_OF_TIME_TO_QUESTION;
    // האם התרגול לא נגמר
    if (!finishPractice) {
        clearInterval(timer);
        document.querySelector(".page.practice .container-questions").innerHTML = "";
    }
    else {
        document.querySelector(".page.practice .container-questions").style.display = "none";
        document.querySelector(".page.practice .container-questions").innerHTML = "";
        document.querySelector(".page.practice .buttons").style.display = "none";

        document.querySelector(".page.practice .container-questions").style.display = "flex";
        document.querySelector(".page.practice .buttons").style.display = "flex";
        document.querySelector(".page.practice .title").style.filter = "unset";
        document.querySelector(".page.practice .score").style.filter = "unset";
        document.querySelector(".page.practice .container-questions").style.filter = "unset";
        document.querySelector(".page.practice .back-btn").style.filter = "unset";
        document.querySelector(".page.practice .buttons").style.filter = "unset";
        document.querySelector(".page.practice .dark").remove();
    }
    document.querySelector(".page.practice .back-btn").remove(); //
    isComplete = false;
}

// הפעלת כפתור חצי חצי
function activateHalfHalfBTN() {
    if (isPressedHalfHalf) {
        return;
    }

    let num1 = null, num2 = null;

    while (num1 === null || num2 === null) {
        // מגריל מספר אקראי בין 1 ל 4
        let randomNumber = Math.floor(Math.random() * 4) + 1;

        if (randomNumber != QUESTIONS[currentQuestion].correctAns.slice(-1)) {
            if (num1 === null) {
                num1 = randomNumber;
            }
            else if (num2 === null && num1 !== randomNumber) {
                num2 = randomNumber;
            }
        }
    }
    document.querySelector(`.page.practice .first-question .ans${num1}`).style.opacity = "0.3";
    document.querySelector(`.page.practice .first-question .ans${num2}`).style.opacity = "0.3";
    document.querySelector(`.page.practice .first-question .ans${num1}`).style.pointerEvents = "none";
    document.querySelector(`.page.practice .first-question .ans${num2}`).style.pointerEvents = "none";

    isPressedHalfHalf = true;

}

// הפעלת כפתור גלה לי 
function showAnswer() {
    if (isComplete) return;
    clearInterval(timer);
    document.querySelector(".page.practice .first-question .next-btn > img").addEventListener("click", nextQuestionPractice);
    document.querySelector(".page.practice .first-question .next-btn > img").style.opacity = "1";

    let rightAnswer;
    if (QUESTIONS[currentQuestion].type === "binary") {
        rightAnswer = QUESTIONS[currentQuestion].trueOrFalse;
        if (rightAnswer) {
            document.querySelector(".page.practice .first-question .right-ans").src = "../assets/images/general/rightSelected_btn.svg";
        }
        else {
            document.querySelector(".page.practice .first-question .wrong-ans").src = "../assets/images/general/wrongSelected_btn.svg";
        }

        // green line
        let greenLine = El("img", { attributes: { src: "../assets/images/general/rightAnswer.svg" }, cls: "line" });/////////////
        document.querySelector(".question").after(greenLine);
    }
    else {
        rightAnswer = QUESTIONS[currentQuestion].correctAns;
        document.querySelector(".page.practice .answer-container." + rightAnswer + "> .ans").style.borderBottom = "2px solid rgb(44, 191, 55)"; //green
        document.querySelector(".page.practice .answer-container." + rightAnswer + "> .ans").style.paddingBottom = "2%";
    }

    isComplete = true;
}

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

// פופאפ לפני המבחן
function beforeExam() {
    document.querySelector(".page.learning.subjects .title").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.subjects .sub-title").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.subjects .cards-container").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.subjects .back-btn").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.subjects .buttons").style.filter = `blur(${blurAmount})`;

    examTime();

    let popup =
        El("div", { cls: "dark" },
            // כל הקלף
            El("div", { cls: "exam-popup" },
                El("img", {
                    attributes: {
                        src: "../assets/images/general/close_btn.svg", class: "close-btn"
                    }, listeners: {
                        // // כפתור סגירה של הפופאפ
                        click: function () {
                            document.querySelector(".page.learning.subjects .title").style.filter = "unset";
                            document.querySelector(".page.learning.subjects .sub-title").style.filter = "unset";
                            document.querySelector(".page.learning.subjects .cards-container").style.filter = "unset";
                            document.querySelector(".page.learning.subjects .back-btn").style.filter = "unset";
                            document.querySelector(".page.learning.subjects .buttons").style.filter = "unset";
                            document.querySelector(".page.learning.subjects .dark").remove();
                        }
                    }
                }),
                // כותרת
                El("div", { cls: "title-popup" }, "לפני שמתחילים"),
                // טקסט של הוראות לפני המבחן
                El("div", { cls: "instructions" },
                    // בלוק 1
                    El("div", { cls: "instruction" },
                        El("div", { cls: "text" },
                            "אנא וודאו כי ברשותכם",
                            El("br", {}),
                            El("b", {}, "קליטה סבירה")
                        ),
                        El("img", { attributes: { src: "../assets/images/exam/beforeExam_popup/cellular_icon.svg", class: "icon1" } }),
                    ),
                    El("div", { cls: "grey-line" }),
                    // בלוק 2
                    El("div", { cls: "instruction" },
                        El("div", { cls: "text" },
                            "שימו לב שזמן המבחן",
                            El("br", {}),
                            "מוגבל לכ-",
                            El("b", {}, `${EXAM_MINUTS} דקות`)
                        ),
                        El("img", { attributes: { src: "../assets/images/exam/beforeExam_popup/timer_icon.svg", class: "icon2" } }),
                    ),
                    El("div", { cls: "grey-line" }),
                    // בלוק 3
                    El("div", { cls: "instruction" },
                        El("div", { cls: "text" },
                            "אם אתם מרגישים",
                            El("br", {}),
                            "לא מוכנים",
                            El("b", {}, " תרגלו עוד")
                        ),
                        El("img", { attributes: { src: "../assets/images/exam/beforeExam_popup/practice_icon.svg", class: "icon3" } }),
                    ),
                    El("div", { cls: "grey-line" }),
                    // בלוק 4
                    El("div", { cls: "instruction" },
                        El("div", { cls: "text" },
                            "הקליקו על הכפתור",
                            El("br", {}),
                            "למעבר בין שאלות"
                        ),
                        El("img", { attributes: { src: "../assets/images/exam/beforeExam_popup/slide_icon.svg", class: "icon4" } }),
                    ),
                    El("div", { cls: "grey-line" }),
                    // בלוק 5
                    El("div", { cls: "instruction" },
                        El("div", { cls: "text" },
                            "תוכלו",
                            El("b", {}, " לדלג על שאלה"),
                            El("br", {}),
                            "בכל עת ולחזור אליה"
                        ),
                        El("img", { attributes: { src: "../assets/images/exam/beforeExam_popup/skip_icon.svg", class: "icon5" } }),
                    ),
                ),
                El("img", {
                    attributes: {
                        src: "../assets/images/general/ok_btn.svg", class: "start-btn"
                    }, listeners: {
                        click: insertFullName_popup
                    }
                })
            )
        );

    document.querySelector(".page.learning.subjects").append(popup);
}

function examTime(){
    // איפוס זמן המבחן לפי בחירת מומחה התוכן
    EXAM_SECONDS = TIME_FOR_EXAM.slice(-2);
    if (EXAM_SECONDS ===  "00")  {
        EXAM_SECONDS = 0;
        if (TIME_FOR_EXAM.length > 4) 
            EXAM_MINUTS = Number(TIME_FOR_EXAM.slice(0,2));
        else
            EXAM_MINUTS = Number(TIME_FOR_EXAM.charAt(0));
        examMinutes = EXAM_MINUTS - 1;
        examSeconds = 59;
    }
    else if (EXAM_SECONDS.charAt(0) === "0") {
        EXAM_SECONDS = Number(TIME_FOR_EXAM.slice(-1));
        if (TIME_FOR_EXAM.length > 4) 
            EXAM_MINUTS = Number(TIME_FOR_EXAM.slice(0,2));
        else
            EXAM_MINUTS = Number(TIME_FOR_EXAM.charAt(0));
        examMinutes = EXAM_MINUTS;
        examSeconds = EXAM_SECONDS;
    }
    else {
        EXAM_SECONDS = Number(TIME_FOR_EXAM.slice(-2));
        if (TIME_FOR_EXAM.length > 4) 
            EXAM_MINUTS = Number(TIME_FOR_EXAM.slice(0,2));
        else
            EXAM_MINUTS = Number(TIME_FOR_EXAM.charAt(0));
        examMinutes = EXAM_MINUTS;
        examSeconds = EXAM_SECONDS;
    }
}

function insertFullName_popup() {
    let countValFirstName = 0;
    let countValLastName = 0;

    // מחיקת התוכן מהפופאפ
    document.querySelector(".page.learning.subjects .instructions").innerHTML = "";
    
    // הוספת שינוי צורה לפופאפ
    document.querySelector(".page.learning.subjects .exam-popup").classList.add("exam-popup-insert-name");

    // הורדת מאזין לחיצה מהכפתור
    document.querySelector(".page.learning.subjects .start-btn").removeEventListener("click", insertFullName_popup); 
    
    // הוספת כותרת פעולה למשתמש
    let firstNameFillText = El("div", {cls: "text-fill-name"},"הכניסו שם פרטי");
    document.querySelector(".page.learning.subjects .instructions").append(firstNameFillText);
    
    // הוספת מקום מילוי הטקסט
    let inputSpaceFirst = El("input", {  
        attributes: {
            type: "text", class: "input-text", placeholder: "ישראל" 
        }, listeners : {
            input: () => {
                countValFirstName = document.querySelector(".page .instructions :nth-child(2)").value.length;
                 // רק במידה ומלאו את שדות המילוי יהיה ניתן לעבור למבחן
                if (countValLastName > 1 && countValFirstName > 1) {
                    firstName = document.querySelector(".page .instructions :nth-child(2)").value;
                    lastName = document.querySelector(".page .instructions :nth-child(4)").value;
                    document.querySelector(".page.learning.subjects .start-btn").classList.add("done"); 
                    // console.log( `${firstName} ${lastName}`);
                }
            }
        }
    });
    document.querySelector(".page.learning.subjects .instructions").append(inputSpaceFirst);
    
    // הוספת כותרת פעולה למשתמש
    let lastNameFillText = El("div", {cls: "text-fill-name"},"הכניסו שם משפחה");
    document.querySelector(".page.learning.subjects .instructions").append(lastNameFillText);
    // הוספת מקום מילוי הטקסט
    let inputSpaceLast = El("input", {  
        attributes: {
            type: "text", class: "input-text", placeholder: "ישראלי" 
        }, listeners : {
            input: () => {
                countValLastName = document.querySelector(".page .instructions :nth-child(4)").value.length;
                // רק במידה ומלאו את שדות המילוי יהיה ניתן לעבור למבחן
                if (countValLastName > 1 && countValFirstName > 1) {
                    firstName = document.querySelector(".page .instructions :nth-child(2)").value;
                    lastName = document.querySelector(".page .instructions :nth-child(4)").value;
                    document.querySelector(".page.learning.subjects .start-btn").classList.add("done"); 
                }
            }
        }
    });
    document.querySelector(".page.learning.subjects .instructions").append(inputSpaceLast);

    // מוסיף עיצוב  לפופאפ הפנימי
    document.querySelector(".page.learning.subjects .instructions").classList.add("insert-name");
    
    document.querySelector(".page.learning.subjects .start-btn").classList.add("insert-name");
    document.querySelector(".page.learning.subjects .start-btn").src = "../assets/images/general/toTheExam.svg";
    document.querySelector(".page.learning.subjects .start-btn").addEventListener("click", () => {
         // כפתור מעבר למבחן מהפופאפ
        document.querySelector(".page.learning.subjects .title").style.filter = "unset";
        document.querySelector(".page.learning.subjects .sub-title").style.filter = "unset";
        document.querySelector(".page.learning.subjects .cards-container").style.filter = "unset";
        document.querySelector(".page.learning.subjects .back-btn").style.filter = "unset";
        document.querySelector(".page.learning.subjects .buttons").style.filter = "unset";
        document.querySelector(".page.learning.subjects .dark").remove();
        document.querySelector(".page.learning.subjects").classList.remove("active");
        document.querySelector(".page.exam").classList.add("active");
        examPage();
    })
}

// הפונקציה מקבלת את העמוד הנוכחי ויוצאת מ
function exit(page) {
    document.querySelector(`.page.${page} .title`).style.filter = `blur(${blurAmount})`;
    document.querySelector(`.page.${page} .sub-titles`).style.filter = `blur(${blurAmount})`;
    document.querySelector(`.page.${page} .questions-container`).style.filter = `blur(${blurAmount})`;
    document.querySelector(`.page.${page} .back-btn`).style.filter = `blur(${blurAmount})`;
    document.querySelector(`.page.${page} .questions-number`).style.filter = `blur(${blurAmount})`;

    let popup =
        El("div", { cls: "dark" },
            El("div", { cls: "exit-popup", },
                El("div", { cls: "title-popup" }, "רוצים לוותר?"),
                El("div", { cls: "sub-title-popup" }, "לא תרצו להמשיך לנסות?"),
                El("img", {
                    attributes: {
                        src: "../assets/images/general/close_btn.svg", class: "close-btn"
                    }, listeners: {
                        // // כפתור סגירה של הפופאפ
                        click: function () {
                            // חזרה למבחן או לתרגול
                            document.querySelector(`.page.${page} .title`).style.filter = "unset";
                            document.querySelector(`.page.${page} .sub-titles`).style.filter = "unset";
                            document.querySelector(`.page.${page} .questions-container`).style.filter = "unset";
                            document.querySelector(`.page.${page} .back-btn`).style.filter = "unset";
                            document.querySelector(`.page.${page} .questions-number`).style.filter = "unset";
                            document.querySelector(".page .dark").remove();
                        }
                    }
                }),
                El("div", { cls: "buttons-exit-popup" },
                    El("img", {

                        attributes: {
                            src: "../assets/images/general/leavePracticeOrExam_popup/back.svg", class: "button-popup",
                        }, listeners: {
                            click: function () {
                                // כפתור יציאה מהתרגול או מהמבחן למסך הבית
                                document.querySelector(`.page.${page} .title`).style.filter = "unset";
                                document.querySelector(`.page.${page} .sub-titles`).style.filter = "unset";
                                document.querySelector(`.page.${page} .questions-container`).style.filter = "unset";
                                document.querySelector(`.page.${page} .back-btn`).style.filter = "unset";
                                document.querySelector(`.page.${page} .questions-number`).style.filter = "unset";
                                document.querySelector(".page .dark").remove();
                                // document.querySelector(`.page.${page}`).classList.remove("active");
                                document.querySelector(`.page.learning.subjects`).classList.add("active");
                                let examStatus = "quit";
                                resetExamPage(examStatus);
                            }
                        }
                    }),
                    El("img", {
                        attributes: {
                            src: "../assets/images/general/leavePracticeOrExam_popup/exit.svg", class: "button-popup"
                        }, listeners: {
                            click: function () {
                                // חזרה למבחן או לתרגול
                                document.querySelector(`.page.${page} .title`).style.filter = "unset";
                                document.querySelector(`.page.${page} .sub-titles`).style.filter = "unset";
                                document.querySelector(`.page.${page} .questions-container`).style.filter = "unset";
                                document.querySelector(`.page.${page} .back-btn`).style.filter = "unset";
                                document.querySelector(`.page.${page} .questions-number`).style.filter = "unset";
                                document.querySelector(".page .dark").remove();
                            }
                        }
                    })
                )
            )

        )
    document.querySelector(`.page.${page}`).append(popup);
}

function donePopup() {
    let popup =
        El("div", { cls: "dark" },
            El("div", { cls: "done-exam-popup", },
                El("div", { cls: "title-popup" }, "בטוח שתרצו להגיש?"),
                El("div", { cls: "sub-title-popup" }, "לא ניתן לחזור אחורה"),
                El("img", {
                    attributes: {
                        src: "../assets/images/general/close_btn.svg", class: "close-btn"
                    }, listeners: {
                        // // כפתור סגירה של הפופאפ
                        click: function () {
                            // חזרה למבחן או לתרגול
                            document.querySelector(`.page.exam .title`).style.filter = "unset";
                            document.querySelector(`.page.exam .sub-titles`).style.filter = "unset";
                            document.querySelector(`.page.exam .questions-container`).style.filter = "unset";
                            document.querySelector(`.page.exam .back-btn`).style.filter = "unset";
                            document.querySelector(`.page.exam .questions-number`).style.filter = "unset";
                            document.querySelector(".page.exam .dark").remove();
                        }
                    }
                }),
                El("div", { cls: "buttons-exit-popup" },
                    El("img", {
                        attributes: {
                            src: "../assets/images/exam/toHand_btn.svg", class: "button-popup",
                        }, listeners: {
                            click: function () {
                                // כפתור הגשה
                                document.querySelector(`.page.exam .title`).style.filter = "unset";
                                document.querySelector(`.page.exam .sub-titles`).style.filter = "unset";
                                document.querySelector(`.page.exam .questions-container`).style.filter = "unset";
                                document.querySelector(`.page.exam .back-btn`).style.filter = "unset";
                                document.querySelector(`.page.exam .questions-number`).style.filter = "unset";
                                document.querySelector(".page.exam .dark").remove();
                                checkAnswer();
                            }
                        }
                    }),
                    El("img", {
                        attributes: {
                            src: "../assets/images/exam/backToExam_btn.svg", class: "button-popup"
                        }, listeners: {
                            click: function () {
                                // חזרה למבחן
                                document.querySelector(`.page.exam .title`).style.filter = "unset";
                                document.querySelector(`.page.exam .sub-titles`).style.filter = "unset";
                                document.querySelector(`.page.exam .questions-container`).style.filter = "unset";
                                document.querySelector(`.page.exam .back-btn`).style.filter = "unset";
                                document.querySelector(`.page.exam .questions-number`).style.filter = "unset";
                                document.querySelector(".page.exam .dark").remove();
                            }
                        }
                    })
                )
            )

        )
    document.querySelector(`.page.exam`).append(popup);
}


// פונציה שמחזירה את השאלות הרצויות למבחן
function questionsToExam() {
    // מערך השאלות הסופי שישלח בסוף הפונקציה
    let selectedQuestions = [];

    // בוחר את השאלות מכל נושא
    for (let subject of SUBJECTS_TITLES) {
        let subjectData = DATA[subject];
        // מספר השאלות לנושא
        let subjectQuestions = subjectData.questionsExam.length;
        // בוחר את מספר השאלות
        let questionCount = Math.min(subjectQuestions, subjectData.amountOfQuestions);
        // מסדר באופן רנדומלי את השאלות ממערך הנתונים
        let shuffledQuestions = shuffle(subjectData.questionsExam.slice());
        // בוחר את האיקס שאלות הראשונות
        selectedQuestions.push(...shuffledQuestions.slice(0, questionCount));
        if (selectedQuestions.length === AMOUNT_OF_TOTAL_QUESTIONS) break;
    }
    return selectedQuestions;
}

// עמוד המבחן
function examPage() {
    // מערך השאלות למבחן
    QUESTIONS = questionsToExam();

    shuffle(QUESTIONS);

    // איפוס צובר כמות השאלות שנענו
    answeredQuestions = 0;

    // הוספת כפתור חזרה למסך הבית
    let backBtn =
        El("img", {
            attributes: { class: "back-btn", src: "../assets/images/general/back_btn.svg" },
            listeners: {
                click: function () {
                    if (!document.querySelector(".page.exam .back-btn").parentElement.classList.contains("done"))
                        exit("exam");
                    else {
                            let examStatus = "quit";
                            resetExamPage(examStatus);
                        }
                }
            }
        });
    document.querySelector(".page.exam").append(backBtn);

    document.querySelector(".page.exam .timer-text").innerHTML = TIME_FOR_EXAM;
    document.querySelector(".page.exam .questionNumber-text").innerHTML = "0" + "/" + QUESTIONS.length;
    timerExam = setInterval(startTimerExam, 1000);

    // איפוס המערך של התשובות
    for (let i = 0; i < QUESTIONS.length; i++) {
        examAnswers[i] = null;
    }

    // מוסיף מספרי שאלות בתחתית המסך
    for (let i = 0; i < QUESTIONS.length; i++) {
        let number =
            El("div", {
                attributes: { class: "number-container", id: ("num" + Number(i + 1)) }, listeners: {
                    click: () => {
                        let previousQuestion = currentQuestionExam;
                        currentQuestionExam = i;
                        if (previousQuestion < i) {
                            moveForward();
                        }
                        else if (previousQuestion > i) {
                            moveBack();
                        }
                    }
                }
            },
                El("img", { attributes: { src: "../assets/images/exam/questionMap_btn.svg", class: "number-img" } }),
                El("div", { cls: "number-text" }, i + 1)
            );
        document.querySelector(".page.exam .questions-number").append(number);
    }

    // יצירת השאלה הראשונה וכרטיסייה ריקה
    emptyCard();
    createQuestionExam();
    addEvantListenersNextBackBTN();
    addEventListenersAnswersEXAM();
}

function emptyCard() {
    let emptyCard =
        El("div", { classes: ["card", "empty-card"] },
            // תמונה של הקלף
            El("img", { attributes: { src: "../assets/images/exam/exam2.svg" } })
        );
    document.querySelector(".page.exam .questions-container").append(emptyCard);
}

// הפונקציה יוצרת תוכן לכרטיסייה ומכניסה אותו לכרטיסייה
function createQuestionExam() {
    let cardContent;
    // האם השאלה היא נכון לא נכון
    if (QUESTIONS[currentQuestionExam].type === "binary") {
        cardContent =
            // השאלה
            El("div", { cls: "question-text" },
                El("div", { cls: "question" }, QUESTIONS[currentQuestionExam].sentence),
                // התשובות
                El("div", { cls: "ans-container" },
                    El("img", { attributes: { src: "../assets/images/general/wrong_btn.svg" }, cls: "wrong-ans" }),
                    El("img", { attributes: { src: "../assets/images/general/right_btn.svg" }, cls: "right-ans" }),
                ),
            );
    }
    // השאלה היא אמריקאית
    else {
        cardContent =
            El("div", { cls: "question-text" },
                // השאלה
                El("div", { cls: "question" }, QUESTIONS[currentQuestionExam].question),
                // התשובות
                El("div", { attributes: { class: "answer-container", id: "ans1" } },
                    El("img", { attributes: { src: "../assets/images/general/chooseQuestion_btn.svg" } }),
                    El("div", { cls: "ans" }, QUESTIONS[currentQuestionExam].ans1)
                ),
                El("div", { attributes: { class: "answer-container", id: "ans2" } },
                    El("img", { attributes: { src: "../assets/images/general/chooseQuestion_btn.svg" } }),
                    El("div", { cls: "ans" }, QUESTIONS[currentQuestionExam].ans2)
                ),
                El("div", { attributes: { class: "answer-container", id: "ans3" } },
                    El("img", { attributes: { src: "../assets/images/general/chooseQuestion_btn.svg" } }),
                    El("div", { cls: "ans" }, QUESTIONS[currentQuestionExam].ans3)
                ),
                El("div", { attributes: { class: "answer-container", id: "ans4" } },
                    El("img", { attributes: { src: "../assets/images/general/chooseQuestion_btn.svg" } }),
                    El("div", { cls: "ans" }, QUESTIONS[currentQuestionExam].ans4)
                )
            );
    }
    // הוספת כפתורי קדימה אחורה
    let buttons =
        El("div", { cls: "next-back-btn" },
            El("div", {cls:"arrows"},
                El("img", { attributes: { src: "../assets/images/exam/next_btn.svg" }, cls: "next" }),
                El("img", { attributes: { src: "../assets/images/exam/back_btn.svg" }, cls: "back" })
            )
        );
    if (currentQuestionExam === QUESTIONS.length - 1)
        buttons.classList.add("last");
    else
        buttons.classList.add(`num${currentQuestionExam + 1}`);

    document.querySelector(".page.exam .empty-card").append(cardContent);
    document.querySelector(".page.exam .empty-card").append(buttons);

    // הופך את הכרטיסייה שמאחורה לכרטיסייה העליונה
    document.querySelector(".page.exam .empty-card").classList.add("first-card");
    document.querySelector(".page.exam .empty-card").style.transform = "unset";
    document.querySelector(".page.exam .empty-card").classList.remove("empty-card");

    // מוריד בהתאמה את כפתורי הבא וחזור (לשאלה ראשונה או אחרונה)
    if (currentQuestionExam === 0) {
        document.querySelector(".page.exam .back").style.visibility = "hidden";
    }
    else if (currentQuestionExam === QUESTIONS.length - 1) {
        document.querySelector(".page.exam .next").style.visibility = "hidden";
    }

    // מציג באיזה שאלה אתה כרגע לפי המספר המודגש למטה
    document.querySelector(`.page.exam #num${currentQuestionExam + 1}`).classList.add("active");

    // הוספה של כרטיסייה ריקה מאחורה
    emptyCard();
}

// בודק האם השאלה שהגענו אליה כבר נענתה
function ifAnswer() {
    // בודק אם השאלה כבר נענתה
    if (examAnswers[currentQuestionExam] !== null) {
        // שאלת נכון לא נכון
        if (QUESTIONS[currentQuestionExam].type === "binary") {
            if (examAnswers[currentQuestionExam]) {
                document.querySelector(".page.exam .card:not(.transition) .right-ans").src = "../assets/images/general/rightSelected_btn.svg";
            } else {
                document.querySelector(".page.exam .card:not(.transition) .wrong-ans").src = "../assets/images/general/wrongSelected_btn.svg";
            }
        }
        // שאלה אמריקאית
        else {
            // מסמן את הכפתור המבוקש
            document.querySelector(`.page.exam .card:not(.transition) #ans${examAnswers[currentQuestionExam] + 1} img`).src = "../assets/images/general/choosenQuestion.svg";
        }
    }
}

// מוסיף מאזיני לחיצה לתשובות השאלה בכרטיסייה העליונה
function addEventListenersAnswersEXAM() {
    // נכון לא נכון
    if (QUESTIONS[currentQuestionExam].type === "binary") {
        if (!document.querySelector(".page.exam.done")) {
            document.querySelector(".page.exam .first-card .right-ans").addEventListener("click", selectAns);
            document.querySelector(".page.exam .first-card .wrong-ans").addEventListener("click", selectAns);
        }
    }
    // אמריקאי
    else {
        // מוסיף לכל התשובות מאזין לחיצה
        let selectedAns = document.querySelectorAll(".page.exam .first-card .answer-container");
        for (let countAns = 0; countAns < 4; countAns++) {
            if (!document.querySelector(".page.exam.done")) {
                selectedAns[countAns].addEventListener("click", selectAns);
            }
        }
    }
}

// הפונקציה המסמנת רק תשובה אחת מתוך האופציות ומעדכנת את מספר השאלות שנענו
function selectAns(event) {

    // עדכון מספר השאלות שנענו
    if (examAnswers[currentQuestionExam] === null) {
        answeredQuestions++;
        document.querySelector(".page.exam .questionNumber-text").innerHTML = answeredQuestions + "/" + QUESTIONS.length;
    }

    finalAnswer = true;
    // נכון לא נכון
    if (QUESTIONS[currentQuestionExam].type === "binary") {
        // מחזיר את כל הכפתורים למצבם ההתחלתי
        document.querySelector(".page.exam .first-card .right-ans").src = "../assets/images/general/right_btn.svg";
        document.querySelector(".page.exam .first-card .wrong-ans").src = "../assets/images/general/wrong_btn.svg";

        // מסמן את הכפתור המבוקש
        if (event.target.classList.contains("wrong-ans")) {
            event.target.src = "../assets/images/general/wrongSelected_btn.svg";
            finalAnswer = false;
        }
        else {
            event.target.src = "../assets/images/general/rightSelected_btn.svg";
            finalAnswer = true;
        }

    }
    // אמריקאי
    else {
        // מחזיר את כל הכפתורים למצבם ההתחלתי
        let selectedAns = document.querySelectorAll(".page.exam .first-card .answer-container");
        for (let countImg = 0; countImg < 4; countImg++) {
            selectedAns[countImg].querySelector("img").src = "../assets/images/general/chooseQuestion_btn.svg";
        }
        // מסמן את הכפתור המבוקש
        event.target.querySelector("img").src = "../assets/images/general/choosenQuestion.svg";

        finalAnswer = Number(event.target.id.charAt(3)) - 1;
    }

    // קונטיינר למספר שאלה לאחר בחירה 
    document.querySelector(`#num${currentQuestionExam + 1}`).style.opacity = 1;
    // מספר שאלה לאחר שנענתה
    examAnswers[currentQuestionExam] = finalAnswer;

    ifComplete();

}

// פונקציה המוסיפה את כפתור ההגשה של המבחן במידה והחניך סיים לענות על כל השאלות
function ifComplete() {
    let isCompleteAnswers = true;
    // לולאה העוברת על כל השאלות במבחן
    for (let i = 0; i < examAnswers.length; i++) {
        if (examAnswers[i] === null) {
            isCompleteAnswers = false;
            return;
        }
    }

    // האם כל השאלות נענו וגם העמוד 
    if (isCompleteAnswers && !document.querySelector(".page.exam.done") && document.querySelector('.page .next-back-btn > img') === null) {
        let finishBtn = El("img", {
            attributes: {
                class: "done-btn", src: "../assets/images/exam/Done_btn.svg",
            },
            listeners: {
                click: () => {
                    donePopup();
                }
            }
        })
        document.querySelector(".page.exam .next-back-btn").append(finishBtn);
        document.querySelector(".page.exam .next-back-btn").style.justifyContent = "space-between";
    }
}

function addEvantListenersNextBackBTN() {
    document.querySelector(".page.exam .first-card .next").addEventListener("click", (event) => {
        currentQuestionExam++;
        moveForward();
    });
    document.querySelector(".page.exam .first-card .back").addEventListener("click", (event) => {
        currentQuestionExam--;
        moveBack();
    });
}

function moveForward() {
    nextQuestionExam();
    document.querySelector(".page.exam .first-card").style.transform = "translateX(108vw)";
}

function moveBack() {
    let nextCard = document.querySelector(".page.exam .empty-card");

    nextQuestionExam();
    let firstCard = document.querySelector(".page.exam .first-card");

    firstCard.classList.remove("transition");
    nextCard.classList.add("transition");
    nextCard.style.transition = "none";
    nextCard.style.transform = "translateX(108vw)";
    void nextCard.clientWidth;
    nextCard.style.transition = "";
    nextCard.style.transform = "";
}

function nextQuestionExam() {
    document.querySelector(".page.exam .number-container.active").classList.remove("active");
    document.querySelector(".page.exam .first-card").classList.add("transition");
    createQuestionExam();

    // היעלמות הכרטיסייה העליונה
    setTimeout(function () {
        document.querySelector(".page.exam .first-card").remove();
        addEvantListenersNextBackBTN();
        addEventListenersAnswersEXAM();
        document.querySelector(".page.exam .first-card").classList.remove("transition");

        // בודק האם כל השאלות נענו, ובהתאם משאיר את כפתור ההגש
        ifComplete();
        if (document.querySelector(".page.exam.done"))
            showAnswersExam();
    }, 1000);

    // בודק האם השאלה שהגענו אליה כבר נענתה
    ifAnswer();
}

// פונקציה שסופרת לאחור את הסמן לסוף המבחן
function startTimerExam() {

    // האם השניות הגיעו ל0
    if (examSeconds < 0) {
        // בודק האם הגיע לסוף הזמן
        if (examMinutes === 0) {
            clearInterval(timerExam);
            timeOver("exam");
            return;
        }
        // עברה דקה
        else {
            examSeconds = 59;
            examMinutes--;
        }
    }
    if (examMinutes === 1 && examSeconds === 0) {
        document.querySelector(".page.exam .timer-text").classList.add("timeFocus");
        setTimeout(function () {
            document.querySelector(".page.exam .timer-text").classList.remove("timeFocus");
        }, 1000);
    }
    // מדפיס את הספרה 0 לפני חד ספרות 
    if (examSeconds < 10) {
        document.querySelector(".page.exam .timer-text").innerHTML = examMinutes + ":0" + examSeconds;
    }
    // להדפיס את השניות והדקות
    else if (examSeconds < AMOUNT_OF_TIME_TO_QUESTION) {
        document.querySelector(".page.exam .timer-text").innerHTML = examMinutes + ":" + examSeconds;
    }
    examSeconds--;
}

// הפונקציה בודקת האם התשובות שסימן החניך נכונות
function checkAnswer() {
    let amountOfCorrectAnswers = 0;

    for (let i = 0; i < examAnswers.length; i++) {
        //נכון לא נכון
        if (QUESTIONS[i].type === "binary") {
            correctAns = QUESTIONS[i].trueOrFalse;
            // האם התשובה הנלחצת היא התשובה הנכונה
            if (examAnswers[i] === correctAns) {
                amountOfCorrectAnswers++;
            }
        }
        // אמריקאי
        else {
            correctAns = QUESTIONS[i].correctAns;
            if (`ans${examAnswers[i] + 1}` === correctAns) {
                amountOfCorrectAnswers++;
            }
        }
    }

    endExam(amountOfCorrectAnswers);
}

// מוסיף פופאפ סיום עם סיכום התוצאות
function endExam(amountOfCorrectAnswers) {
    clearInterval(timerExam);

    document.querySelector(".page.exam .header").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.exam .questions-number").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.exam .questions-container").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.exam .back-btn").style.filter = `blur(${blurAmount})`;

    // חישוב כמה דקות היה המבחן
    let minutes = EXAM_MINUTS - examMinutes;
    let seconds = Number(59 - examSeconds);
    // בודק האם השניות הגיעו לדקה
    if (seconds === "60") {
        seconds = 0;
        textSec = "00"; // ...בגלל שאי אפשר לכתוב כערך מספרי פעמיים אפס
        minutes++;
    } else if (seconds < 10) {
        textSec = "0" + seconds;
    }
    else {
        textSec = seconds;
    }
    totalTimeExam = minutes + ":" + textSec; // להצגה במסך
    let UserTotalTimeSec = Number(minutes * 60 + seconds); // לחישוב בבר
    let examTotalTimeInSec = EXAM_MINUTS * 60 + 60; // לחישוב בבר

    // הטקסט לכותרות לפי ההצלחה של המשתמש
    let name;
    let img;
    let date;
    let grade;

    name = `${firstName} ${lastName}`;
    date = new Date();
    let todayDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    let currTime = date.getHours() + ":" + date.getMinutes();
    grade = amountOfCorrectAnswers / QUESTIONS.length * 100; 

    // האם כמות התשובות הנכונות גדולה מחצי מהשאלות
    if (amountOfCorrectAnswers > QUESTIONS.length / 2) 
        img = "../assets/images/general/finish_popup/check_icon.svg"
    else 
        img = "../assets/images/general/finish_popup/x_icon.svg"                  

    let finishPopup =
        El("div", { cls: "dark" },
            // כל הקלף
            El("div", { cls: "end-exam" },
                El("img", { attributes: { src: "../assets/images/general/close_btn.svg", class: "close-btn" } }),
                // כותרות
                El("div", { cls: "title-popup" }, name),
                El("div", { cls: "popup-sub-titles" },
                    El("div", { cls: "text1-popup" }, "ציון: " + grade),
                    El("div", { cls: "text2-popup" }, `${currTime} | ${todayDate}`),
                ),
                El("div", { cls: "instructions-practice" },
                    // בלוק 1
                    El("div", { cls: "grey-line" }),
                    El("div", { cls: "container-resultes" },
                        El("div", { cls: "summery-titles" },
                            El("div", { cls: "titleAndIcon-container" },
                                El("div", {},
                                    amountOfCorrectAnswers + " " + "תשובות נכונות"
                                ),
                                El("img", { attributes: { src: img, class: "checkIcon-btn" } }),
                            ),
                            "מתוך " + QUESTIONS.length + " שאלות",
                        ),
                        El("div", { cls: "progress-bar-container" },
                            El("div", { cls: "progress-bar-right-answers" })
                        ),
                    ),
                    // בלוק 2 
                    El("div", { cls: "grey-line" }),
                    El("div", { cls: "container-resultes" },
                        El("div", { cls: "summery-titles" },
                            El("div", { cls: "titleAndIcon-container" },
                                El("div", {},
                                    totalTimeExam + " דקות"
                                ),
                                El("img", { attributes: { src: "../assets/images/general/finish_popup/timer_icon.svg", class: "timeIcon-btn" } }),
                            ),
                            "משך זמן המבחן",
                        ),
                        El("div", { cls: "progress-bar-container" },
                            El("div", { cls: "progress-bar-time" })
                        ),
                    ),

                    El("div", { cls: "grey-line" }),
                ),

                El("div", { cls: "buttons-popup" },
                    El("img", { attributes: { src: "../assets/images/general/finish_popup/showExam_btn.svg", class: "backToExam-btn" } }), // להוסיף אפשרות של בדיקת התשובות 
                    El("img", { attributes: { src: "../assets/images/general/finish_popup/tohome_btn.svg", class: "backToHome-btn" } })
                )
            )
        );

    document.querySelector(".page.exam").append(finishPopup);
    document.querySelector(".page.exam .progress-bar-right-answers").style.width = amountOfCorrectAnswers / QUESTIONS.length * 100 + "%";
    document.querySelector(".page.exam .progress-bar-time").style.width = 100 - (UserTotalTimeSec * 100 / examTotalTimeInSec) + "%";

    // מעבר לדף הבית בלחיצה על הכפתור
    document.querySelector(".page.exam .backToHome-btn").addEventListener("click", () => {
        let examStatus = "end";
        resetExamPage(examStatus);
    });

    // מעבר לבדיקת המבחן בלחיצה על הכפתור
    document.querySelector(".page.exam .backToExam-btn").addEventListener("click", () => {
        document.querySelector(".page.exam").classList.add("done");
        let examStatus = "view";
        resetExamPage(examStatus);

        document.querySelector(".page.exam .header").style.filter = "unset";
        document.querySelector(".page.exam .questions-number").style.filter = "unset";
        document.querySelector(".page.exam .questions-container").style.filter = "unset";
        document.querySelector(".page.exam .back-btn").style.filter = "unset";
        document.querySelector(".page.exam .end-exam").remove();
        document.querySelector(".page.exam .dark").remove();

        // יצירת השאלה הראשונה וכרטיסייה ריקה
        document.querySelector(".page.exam .questions-container").innerHTML = "";
        emptyCard();
        createQuestionExam();
        addEvantListenersNextBackBTN();
        addEventListenersAnswersEXAM();
        document.querySelector(".page.exam .back-btn").src = "../assets/images/exam/toHome_btn.svg";
        document.querySelector(".page.exam .back-btn").classList.add("backHome-btn");

        // גילוי תשובות נכונות וטעויות על הכרטסיות
        showAnswersExam();
        //גילוי עיגול אדום או ירוק לפי התשובה על הניווט התחתון עם המספרים
        document.querySelector(".page.exam .questions-number").scrollLeft = document.querySelector(".page.exam .questions-number").offsetWidth;
        // console.log(document.querySelector(".page.exam .questions-number").offsetWidth);
        showQuestionsValidity();
        //
        ifAnswer();
    });

    // מעבר לדף הבית בלחיצה על הכפתור
    document.querySelector(".page.exam .close-btn").addEventListener("click", () => {
        let examStatus = "end";
        resetExamPage(examStatus);
    });
}

// מאתחלת את מצב המבחן לפי ההכפתור עליו לחץ החניך
function resetExamPage(examStatus) {
    document.querySelector(`.page.exam #num${currentQuestionExam + 1}`).classList.remove("active");
    // איפוס השאלה הנוכחית 
    currentQuestionExam = 0;

    // כפתור המצב הרצוי של החניך
    switch (examStatus) {
        // החניך סיים את המבחן
        case "end": {
            document.querySelector(".page.exam .back-btn").remove();
            document.querySelector(".page.exam").classList.remove("active");
            document.querySelector(".page.learning.subjects").classList.add("active");
            document.querySelector(".page.exam .end-exam").remove();
            document.querySelector(".page.exam .dark").remove();
            clearInterval(timer);
            document.querySelector(".page.exam .questions-container").innerHTML = "";
            document.querySelector(".page.exam .questions-number").innerHTML = "";
            break;
        }
        // החניך יצא באמצע המבחן
        case "quit": {
            // איפוס הזמן
            clearInterval(timerExam);

            document.querySelector(".page.exam .back-btn").remove();

            document.querySelector(".page.exam").classList.remove("active");
            document.querySelector(".page.learning.subjects").classList.add("active");
            document.querySelector(".page.exam .questions-container").innerHTML = "";
            document.querySelector(".page.exam .questions-number").innerHTML = "";
            if (document.querySelector(".page.exam.done"))
                document.querySelector(".page.exam.done").classList.remove("done");
            break;
        }
        // החניך בחר לראות את תוצאות המבחן
        case "view": {
            document.querySelector(".page.exam").classList.add("done");
            ifComplete();
            break;
        }
    }
    if (examStatus != "quit") {
        // הורדת הטשטוש של הרקע
        document.querySelector(".page.exam .header").style.filter = "unset";
        document.querySelector(".page.exam .questions-number").style.filter = "unset";
        document.querySelector(".page.exam .questions-container").style.filter = "unset";
    }
}

// הפונקציה מופעלת לאחר לחיצה על כפתור עיון במבחן ומוסיפה לכל שאלה את התשובה שלה
function showAnswersExam() {
    let correctAns;
    // בודק האם השאלה הנוכחית היא בינרית
    if (QUESTIONS[currentQuestionExam].type === "binary") {
        correctAns = QUESTIONS[currentQuestionExam].trueOrFalse;
        // האם התשובה הנלחצת היא התשובה הנכונה
        if (examAnswers[currentQuestionExam] === correctAns) {
            // green line
            let greenLine = El("img", { attributes: { src: "../assets/images/general/rightAnswer.svg" }, cls: "line" });/////////////
            document.querySelector(".page.exam .first-card .question").after(greenLine);
        }
        // התשובה לא נכונה
        else {
            // red line
            let redLine = El("img", { attributes: { src: "../assets/images/general/wrongAnswer.svg" }, cls: "line" });/////////////
            document.querySelector(".page.exam .first-card .question").after(redLine);
        }
    }
    // אמריקאי
    else {
        correctAns = QUESTIONS[currentQuestionExam].correctAns;
        document.querySelector(`#${correctAns} > .ans`).style.borderBottom = "2px solid rgb(44, 191, 55)"; //green
        document.querySelector(`#${correctAns} > .ans`).style.paddingBottom = "2%";

        // האם התשובה הנלחצת היא לא התשובה הנכונה
        if (`ans${examAnswers[currentQuestionExam] + 1}` !== correctAns) {
            document.querySelector(`#ans${examAnswers[currentQuestionExam] + 1} > .ans`).style.borderBottom = "2px solid rgb(277, 58, 78)"; //red
            document.querySelector(`#ans${examAnswers[currentQuestionExam] + 1} > .ans`).style.paddingBottom = "2%";
        }
    }
}

// למספרי השאלות בתחתית העמוד יתווסף נקודה אדומה במידה והחניך טעה בשאלה, ונקודה ירוקה במידה וצדק בה 
function showQuestionsValidity() {
    for (let i = 0; i < QUESTIONS.length; i++) {
        // השאלה הנוכחית היא מסוג נכון לא נכון
        if (QUESTIONS[i].trueOrFalse !== undefined) {
            if (examAnswers[i] === QUESTIONS[i].trueOrFalse)
                document.querySelector(`#num${i + 1}`).append(El("div", { classes: ["circle", "correct"] }));
            else
                document.querySelector(`#num${i + 1}`).append(El("div", { classes: ["circle", "wrong"] }));
        }
        // השאלה הנוכחית היא שאלה מסוג אמריקאית
        else {
            if (examAnswers[i] === Number(QUESTIONS[i].correctAns.slice(-1) - 1))
                document.querySelector(`#num${i + 1}`).append(El("div", { classes: ["circle", "correct"] }));
            else
                document.querySelector(`#num${i + 1}`).append(El("div", { classes: ["circle", "wrong"] }));

        }
    }
}
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

// עמוד הלמידה
function subjectLearningPage(subject) {
    // הוספת כפתור חזרה למסך הבית
    let backBtn =
        El("img", {
            attributes: { class: "back-btn", src: "../assets/images/general/back_btn.svg" },
            listeners: {
                click: function () {
                    document.querySelector(".page.learning.subjects").classList.add("active");
                    document.querySelector(".page.learning.content").classList.remove("active");
                    resetLearningPage();
                }
            }
        });
    document.querySelector(".page.learning.content").append(backBtn);

    // הוספת כפתור חזרה למסך הבית
    let practiceBtn =
        El("img", {
            attributes: { class: "practice-btn", src: "../assets/images/general/practice_btn.svg" },
            listeners: {
                click: function () {
                    practicePopup(subject);
                }
            }
        });
    document.querySelector(".page.learning.content").append(practiceBtn);

    // הוספת כותרת
    document.querySelector(".page.learning.content .title").innerHTML = subject;
    // הוספת תתי נושאים לכותרת
    let subjects = El("div", { cls: "container-subjects" });
    document.querySelector(".page.learning.content .title").after(subjects);
    
    // הופסת דיב ראשוני לבר הניווט כדי שהתת נושא הראשון יהיה במרכז
    let beforeSpace = El("div", {cls: "space"});
    document.querySelector(".page.learning.content .container-subjects").append(beforeSpace);


    let id = 0;
    // לכל תת נושא 
    for (let sub of Object.keys(DATA[subject].learningContent)) {
        // זה משתנה שמכיל את כל תתי תתי הנושאים לאותו תת נושא 
        let subSubTopics = Object.keys(DATA[subject].learningContent[sub]);

        // יוצר תת נושא ואת כל תת תת הנושאים
        let subTopic =
            El("div", { cls: "sub-topics-container" },
                El("div", { cls: "sub-topic" },
                    El("img", { attributes: { class: "arrow", src: "../assets/images/learning/openArrow_icon.svg" } }),
                    El("div", { cls: "sub-title" }, sub),
                ),
                // יוצר מערך של אלמנטים ומעביר כל אלמנט בנפרד מחוץ למערך (...=)
                ...subSubTopics.map(
                    subSubTopic => El("div", {
                        attributes: { class: "sub-sub-topic" },
                        listeners: { click: () => { relevantCard(subSubTopic) } }
                    }, subSubTopic
                    )
                )
            );
        subTopic.typeIndex = id;

        // מוסיפים את התת נושא לתפריט ניווט
        let menu = document.querySelector(".page.learning.content .container-subjects");
        menu.append(subTopic);
        
        // מוסיף את כל הכרטיסיות של התת נושא
        let arrCards = subSubTopics.map(subSubTopic => {
            // גייסון של כל תתי תתי הנושא
            let json = DATA[subject].learningContent[sub][subSubTopic];

            let group = El("div", { classes: ["card-group", `sub-${id}`] });
            if (json.length > 1) {
                let next = generateCard(json, subSubTopic, 1);
                next.classList.add("next");
                group.append(next);
            }
            let card = generateCard(json, subSubTopic, 0);
            group.append(card);
            return group;
        });
        document.querySelector(".page.learning.content .cards-container").append(...arrCards);
        id++;
    }
    document.querySelector(".page.learning.content .container-subjects").scrollLeft = document.querySelector(".page.learning.content .container-subjects").scrollWidth;
    // הפונקציה גוללת אל הכרטיסייה הנלחצת על ידי החניך 
    function relevantCard(cardTitle) {
        document.querySelectorAll(".page.learning.content .card-group.block").forEach(function (card) {
            if (card.querySelector(".title").textContent === cardTitle) {
                card.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        })
    }

    // יוצר כרטיסייה חדשה
    function generateCard(json, title, index) {
        // משכפל את הטמפלייט של הכרטיסייה
        let template = document.querySelector(`.page.learning.content .templates > .${getType(json[index].cardType)}`);
        // יוצר אלמנט של קונטיינר לתוכן (כדי שתהיה גלילה יפה בתוך הכרטיסייה)
        let container = El("div", { cls: "content-container" });
        let card = El("div", { classes: ["card", getType(json[index].cardType)] }, container);
        container.append(template.content.cloneNode(true));

        let cardType = CARD_TYPES[json[index].cardType];
        cardType.init(card, json[index]);
        card.querySelector(".title").innerHTML = title;
        if (json.length > 1) {
            let buttons =
                El("div", { cls: "next-back-btn" },
                    El("img", { attributes: { src: "../assets/images/exam/next_btn.svg" }, cls: "next", listeners: { click: changeCard.bind(card, "next", json, index) } }),
                    El("img", { attributes: { src: "../assets/images/exam/back_btn.svg" }, cls: "back", listeners: { click: changeCard.bind(card, "back", json, index) } })
                );
            if (index === 0)
                buttons.classList.add("first");
            if (index === json.length - 1)
                buttons.classList.add("last");
            card.append(buttons);
        }
        return card;
    }
    let coolDown = -1;

    // הפונקציה מעבירה לפי הכפתור שנלחץ לכרטיסייה המתאימה בתת תת נושא
    function changeCard(direction, json, index) {
        if (coolDown !== -1) return;
        coolDown = setTimeout(() => coolDown = -1, timeToTransition(this, "transform") + 100);
        if (direction === "back") {
            let next = this.parentElement.querySelector(".card.next");
            let card = generateCard(json, this.querySelector(".title").innerHTML, index - 1);
            card.classList.add("prev");
            this.parentElement.append(card);
            void card.clientWidth;
            card.classList.remove("prev");
            this.classList.add("next");
            if (next) setTimeout(() => next.remove(), timeToTransition(next, "transform"));
        }
        else if (direction === "next") {
            this.classList.add("prev");
            this.parentElement.querySelector(".card.next").classList.remove("next");
            if (json.length - 2 > index) {
                let card = generateCard(json, this.querySelector(".title").innerHTML, index + 2);
                card.classList.add("next");
                this.parentElement.prepend(card);
            }
            setTimeout(() => this.remove(), timeToTransition(this, "transform"));
        }
    }

    // פונקציה שהופכת את כל מה שנמצא עם אות גדולה להפרדה בין מילים עם מקפים
    function getType(type) {
        return type.replace(/.[A-Z]/g, (str) => `${str.substr(0, 1)}-${str.substr(1).toLowerCase()}`);
    }

    // מאזין לגלילה של התתי נושאים, הופך את הנושאים שלא ממורכזים לבעלי שקיפות
    document.querySelector(".page.learning.content .container-subjects").addEventListener("scroll", function () {
        let midPage = window.innerWidth / 2;
        let smallestDifference = 1000;
        let count = 0;

        for (let sub of this.children) {
            let pos = sub.getBoundingClientRect();
            let _positonX = pos.x ? pos.x : 70;
            let positionX = (_positonX + pos.right) / 2;
            // בדיקה מה האלמנט שנמצא כרגע במרכז המסך
            if (Math.abs(midPage - positionX) < smallestDifference) {
                let el = document.querySelector(".sub-topics-container.open");

                if (el !== null && el !== this) {
                    el.classList.remove("open");
                    animateDims(el, true, "height");
                }
                smallestDifference = Math.abs(midPage - positionX);
                midElement = sub;
                midElPlace = count;
            }
            count++;
            sub.style.opacity = "0.6";
        }
        midElement.style.opacity = "";

        let cardGroup = document.querySelectorAll(".page.learning.content .card-group");

        // האם התת נושא שנמצא כרגע באמצע המסך לא שווה לנושא שאמור להיות כרגע באמצע
        // אז התנאי יוסיף את כרטיסיות הלימוד הרלוונטיות
        if (midElPlace !== currSubjCount) {
            currSubjCount = midElPlace;
            document.querySelector(".page.learning.content .cards-container").scrollTop = 0;
            document.querySelectorAll(".page.learning.content .card-group").forEach(el => el.style.display = "");

            // הורדת הבלוק על כל הכרטיסיות בכל התת נושאים
            for (let i = 0; i < cardGroup.length; i++) {
                if (cardGroup[i].classList.contains("block"))
                    cardGroup[i].classList.remove("block");
            }
            // הוספת הבלוק לכרטיסיות הרלוונטיות לפי תת הנושא
            document.querySelectorAll(`.page.learning.content .card-group.sub-${midElement.typeIndex}`).forEach(el => el.classList.add("block"));
        }
    }, { passive: true });

    
    // הוספת מאזין לחיצה בעבור כל תת נושא, ובלחיצה על נושא שאינו במרכז, הפונקציה תעבור אליו בצורה חלקה ויפהה
    document.querySelectorAll(".page.learning.content .sub-topics-container").forEach(el => {
        el.addEventListener("click",
            /**
             * @this {HTMLElement}
            */
            function () {
                // בודק אם התת נושא הקודם כבר היה לחוץ
                let el = document.querySelector(".sub-topics-container.open");
                if (el !== null && el !== this) {
                    el.classList.remove("open");
                    animateDims(el, true, "height");
                }

                // האם האלמנט הנוכחי שנלחץ הוא לא במרכז
                if (midElement !== this) {
                    // מעבר אל האלמנט הנלחץ שיהיה במרכז המסך
                    let parent = this.parentElement;
                    
                    // זה עובד טוב כשרואים על המחשב
                    // let scroll = (parent.scrollWidth - parent.offsetWidth) + this.offsetLeft - (parent.offsetWidth - this.offsetWidth) / 2;
                    // parent.scrollLeft = scroll;

                    // האם מיקום האלמנט הנלחץ גדול ממיקום האלמנט המרכזי 
                    if(this.offsetLeft > midElement.offsetLeft)
                        parent.scrollLeft += this.offsetWidth;
                    else
                        parent.scrollLeft -= this.offsetWidth;

                    // האלמנט שנלחץ הוא כבר במרכז המסך
                } else {
                    let opened = this.classList.toggle("open"); 
                    animateDims(this, !opened, "height");
                }
            })
    });
}

// ניקוי עמוד הלמידה לאחר יציאה ממנו
function resetLearningPage() {
    currSubjCount = -1;
    document.querySelector(".page.learning.content .cards-container").innerHTML = "";
    document.querySelector(".page.learning.content .container-subjects").remove();
    document.querySelector(".page.learning.content .practice-btn").remove();
    document.querySelector(".page.learning.content .back-btn").remove();
}

//
function practicePopup(subject) {
    document.querySelector(".page.learning.content .title").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.content .container-subjects").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.content .practice-btn").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.content .back-btn").style.filter = `blur(${blurAmount})`;
    document.querySelector(".page.learning.content .cards-container").style.filter = `blur(${blurAmount})`;
    let popup =
        El("div", { cls: "dark" },
            // כל הקלף
            El("div", { cls: "before-practice-one-sub" },
                El("img", {
                    attributes: {
                        src: "../assets/images/general/close_btn.svg", class: "close-btn"
                    }, listeners: {
                        // // כפתור סגירה של הפופאפ
                        click: function () {
                            document.querySelector(".page.learning.content .title").style.filter = "unset";
                            document.querySelector(".page.learning.content .container-subjects").style.filter = "unset";
                            document.querySelector(".page.learning.content .practice-btn").style.filter = "unset";
                            document.querySelector(".page.learning.content .back-btn").style.filter = "unset";
                            document.querySelector(".page.learning.content .cards-container").style.filter = "unset";
                            document.querySelector(".page.learning.content .dark").remove();
                        }
                    }
                }),
                // כותרת
                El("div", { cls: "title-popup" }, "לפני שמתחילים"),
                El("div", { cls: "instructions-practice" },
                    // בלוק 1
                    El("div", { cls: "instruction-practice" },
                        El("div", { cls: "text" },
                            El("b", {}, "2 דקות"),
                            " לכל שאלה",
                        ),
                        El("img", { attributes: { src: "../assets/images/exam/beforeExam_popup/timer_icon.svg", class: "icon2" } }),
                    ),
                    El("div", { cls: "grey-line" }),
                    // בלוק 2
                    El("div", { cls: "instruction-practice" },
                        El("div", { cls: "text" },
                            "זה רק",
                            El("b", {}, " תרגול")
                        ),
                        El("img", { attributes: { src: "../assets/images/practice/beforePractice_popup/blow_icon.svg", class: "icon2" } }),
                    ),
                    El("div", { cls: "grey-line" }),
                    // בלוק 3
                    El("div", { cls: "instruction-practice" },
                        El("div", { cls: "text" },
                        El("b", {}, " הקליקו") ,
                            " למעבר בין השאלות",
                        ),
                        El("img", { attributes: { src: "../assets/images/practice/beforePractice_popup/slide_icon.svg", class: "icon4" } }),
                    ),
                    El("div", { cls: "grey-line" }),
                ),
                El("img", {
                    attributes: {
                        src: "../assets/images/general/ok_btn.svg", class: "start-btn"
                    }, listeners: {
                        click: function () {
                            // כפתור מעבר למבחן מהפופאפ
                            document.querySelector(".page.learning.content .title").style.filter = "unset";
                            document.querySelector(".page.learning.content .container-subjects").style.filter = "unset";
                            document.querySelector(".page.learning.content .practice-btn").style.filter = "unset";
                            document.querySelector(".page.learning.content .back-btn").style.filter = "unset";
                            document.querySelector(".page.learning.content .cards-container").style.filter = "unset";
                            document.querySelector(".page.learning.content .dark").remove();
                            document.querySelector(".page.learning.content").classList.remove("active");
                            document.querySelector(".page.practice").classList.add("active");
                            theChosenSub(subject);
                            resetLearningPage();
                            practicePage();
                        }
                    }
                })
            )
        );

    document.querySelector(".page.learning.content").append(popup);
}
function theChosenSub(subject) {
    for (let i = 0; i < SUBJECTS_TITLES.length; i++) {
        selectedSubjects[i] = false;
    }
    for (let i = 0; i < SUBJECTS_TITLES.length; i++) {
        if (subject === SUBJECTS_TITLES[i]) {
            selectedSubjects[i] = true;
            return;
        }
    }
}

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

// הפונקצייה מוסיפה 
function timeOver(page) {
    // עצירת הטיימר
    if (page === "practice") {
        clearInterval(timer);
        showAnswer();
    }
    // החניך היה באמצע מבחן
    else {
        // איפוס הזמן
        clearInterval(timerExam);

        // הוספה לרקע טשטוש
        document.querySelector(`.page.${page} .title`).style.filter = `blur(${blurAmount})`;
        document.querySelector(`.page.${page} .back-btn`).style.filter = `blur(${blurAmount})`;
        if (page === "practice") {
            document.querySelector(`.page.${page} .score`).style.filter = `blur(${blurAmount})`;
            document.querySelector(`.page.${page} .container-questions`).style.filter = `blur(${blurAmount})`;
            document.querySelector(`.page.${page} .buttons`).style.filter = `blur(${blurAmount})`;
        }
        else {
            document.querySelector(`.page.${page} .questions-container`).style.filter = `blur(${blurAmount})`;
            document.querySelector(`.page.${page} .questions-number`).style.filter = `blur(${blurAmount})`;
            document.querySelector(`.page.${page} .sub-titles`).style.filter = `blur(${blurAmount})`;
        }
        // הוספת פופאפ
        let popup =
            El("div", { cls: "dark" },
                El("div", { cls: "exit-popup", },
                    El("div", { cls: "title-popup" }, "נגמר הזמן..."),
                    El("div", { cls: "sub-title-popup" }, "פעם הבאה ענו קצת יותר מהר:)"),
                    El("div", { cls: "buttons-exit-popup" },
                        // כפתור חזרה למסך הבית
                        El("img", {
                            attributes: {
                                src: "../assets/images/general/leavePracticeOrExam_popup/back.svg", class: "button-popup",
                            }, listeners: {
                                click: function () {
                                    // כפתור יציאה מהתרגול או מהמבחן למסך הבית
                                    document.querySelector(`.page.${page} .title`).style.filter = "unset";
                                    document.querySelector(`.page.${page} .back-btn`).style.filter = "unset";
                                    if (page === "practice") {
                                        document.querySelector(`.page.${page} .score`).style.filter = "unset";
                                        document.querySelector(`.page.${page} .container-questions`).style.filter = "unset";
                                        document.querySelector(`.page.${page} .buttons`).style.filter = "unset";
                                    }
                                    else {
                                        document.querySelector(`.page.${page} .questions-container`).style.filter = "unset";
                                        document.querySelector(`.page.${page} .questions-number`).style.filter = "unset";
                                        document.querySelector(`.page.${page} .sub-titles`).style.filter = "unset";
                                    }
                                    document.querySelector(".page .dark").remove();
                                    document.querySelector(`.page.${page}`).classList.remove("active");
                                    document.querySelector(`.page.learning.subjects`).classList.add("active");

                                    if (page === "exam") {
                                        let examStatus = "quit";
                                        resetExamPage(examStatus);
                                    }
                                    else {
                                        resetPrecticePage(false);
                                    }
                                }
                            }
                        }),
                        // כפתור חזרה לניסיון נוסף לתרגול או המבחן
                        El("img", {
                            attributes: {
                                src: "../assets/images/general/tryAgainBtn.svg", class: "button-popup"
                            }, listeners: {
                                click: function () {
                                    // חזרה על המבחן או התרגול
                                    document.querySelector(`.page.${page} .title`).style.filter = "unset";
                                    document.querySelector(`.page.${page} .back-btn`).style.filter = "unset";
                                    if (page === "practice") {
                                        document.querySelector(`.page.${page} .score`).style.filter = "unset";
                                        document.querySelector(`.page.${page} .container-questions`).style.filter = "unset";
                                        document.querySelector(`.page.${page} .buttons`).style.filter = "unset";
                                    }
                                    else {
                                        document.querySelector(`.page.${page} .questions-container`).style.filter = "unset";
                                        document.querySelector(`.page.${page} .questions-number`).style.filter = "unset";
                                        document.querySelector(`.page.${page} .sub-titles`).style.filter = "unset";
                                    }
                                    document.querySelector(".page .dark").remove();
                                    // החניך היה באמצע תרגול
                                    if (page === "practice") {
                                        practiceSeconds = AMOUNT_OF_TIME_TO_QUESTION;
                                        resetPrecticePage(false);
                                        practicePage();
                                    }
                                    // החניך היה באמצע מבחן
                                    else {
                                        // איפוס השאלה הנוכחית 
                                        currentQuestionExam = 0;
                                        document.querySelector(".page.exam .questions-container").innerHTML = "";
                                        document.querySelector(".page.exam .questions-number").innerHTML = "";
                                        document.querySelector(".page.exam .back-btn").remove();
                                        examPage();
                                    }
                                }
                            }
                        })
                    )
                )

            )
        document.querySelector(`.page.${page}`).append(popup);
    }
}


// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

/*
             shuffle
            =========
Description: take orgnaiz array and shffel it
Parameters: array.
------------------------------------------------
Programer: Gal
------------------------------------------------
*/
function shuffle(arr) {
    var tmp = arr.slice();
    for (var i = 0; i < arr.length; i++) {
        var index = Math.floor(Math.random() * tmp.length);
        arr[i] = tmp[index];
        tmp = tmp.slice(0, index).concat(tmp.slice(index + 1));
    }
    return arr;
}


