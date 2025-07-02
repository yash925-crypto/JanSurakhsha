export class QuizEngine {
  constructor() {
    this.questions = [
      {
        question: "What should you do first during an earthquake?",
        questionHi: "भूकंप के दौरान आपको सबसे पहले क्या करना चाहिए?",
        options: ["Run outside", "Drop, Cover, Hold On", "Call for help", "Stand in doorway"],
        optionsHi: ["बाहर भागें", "गिरें, छुपें, पकड़ें", "मदद के लिए चिल्लाएं", "दरवाजे में खड़े हों"],
        correct: 1,
        explanation: "Drop, Cover, and Hold On is the recommended action during earthquakes.",
        explanationHi: "भूकंप के दौरान गिरना, छुपना और पकड़ना अनुशंसित कार्य है।",
      },
      {
        question: "How much water should you store per person for emergencies?",
        questionHi: "आपातकाल के लिए प्रति व्यक्ति कितना पानी स्टोर करना चाहिए?",
        options: ["1 liter per day", "2 liters per day", "4 liters per day", "6 liters per day"],
        optionsHi: ["प्रति दिन 1 लीटर", "प्रति दिन 2 लीटर", "प्रति दिन 4 लीटर", "प्रति दिन 6 लीटर"],
        correct: 2,
        explanation: "Store at least 4 liters of water per person per day for drinking and sanitation.",
        explanationHi: "पीने और स्वच्छता के लिए प्रति व्यक्ति प्रति दिन कम से कम 4 लीटर पानी स्टोर करें।",
      },
      {
        question: "What is the emergency number for ambulance in India?",
        questionHi: "भारत में एम्बुलेंस का आपातकालीन नंबर क्या है?",
        options: ["100", "101", "108", "112"],
        optionsHi: ["100", "101", "108", "112"],
        correct: 2,
        explanation: "108 is the national ambulance service number in India.",
        explanationHi: "108 भारत में राष्ट्रीय एम्बुलेंस सेवा नंबर है।",
      },
      {
        question: "During a fire, you should:",
        questionHi: "आग के दौरान, आपको चाहिए:",
        options: ["Use elevator", "Crawl low under smoke", "Open all windows", "Hide in bathroom"],
        optionsHi: ["लिफ्ट का उपयोग करें", "धुएं के नीचे रेंगकर चलें", "सभी खिड़कियां खोलें", "बाथरूम में छुपें"],
        correct: 1,
        explanation: "Crawl low under smoke to avoid inhaling toxic gases and to see better.",
        explanationHi: "जहरीली गैसों को सांस में लेने से बचने और बेहतर देखने के लिए धुएं के नीचे रेंगकर चलें।",
      },
      {
        question: "What should you NOT do during a flood?",
        questionHi: "बाढ़ के दौरान आपको क्या नहीं करना चाहिए?",
        options: ["Move to higher ground", "Walk through moving water", "Listen to radio", "Turn off electricity"],
        optionsHi: ["ऊंची जगह पर जाएं", "बहते पानी में चलें", "रेडियो सुनें", "बिजली बंद करें"],
        correct: 1,
        explanation: "Never walk through moving flood water - just 6 inches can knock you down.",
        explanationHi: "कभी भी बहते बाढ़ के पानी में न चलें - केवल 6 इंच पानी आपको गिरा सकता है।",
      },
    ]

    this.currentQuestion = 0
    this.score = 0
    this.streak = this.getStreak()
    this.selectedAnswer = null
    this.language = "en"
  }

  startQuiz() {
    this.loadQuizStats()
    this.currentQuestion = 0
    this.score = 0
    this.selectedAnswer = null
    this.showQuestion()
    this.setupQuizEventListeners()
  }

  setupQuizEventListeners() {
    document.getElementById("submitAnswer").addEventListener("click", () => {
      this.submitAnswer()
    })

    document.getElementById("nextQuestion").addEventListener("click", () => {
      this.nextQuestion()
    })
  }

  showQuestion() {
    const question = this.questions[this.currentQuestion]
    const questionText = document.getElementById("questionText")
    const optionsContainer = document.getElementById("optionsContainer")
    const submitBtn = document.getElementById("submitAnswer")

    // Set question text based on language
    questionText.textContent = this.language === "hi" ? question.questionHi : question.question

    // Clear previous options
    optionsContainer.innerHTML = ""

    // Create option buttons
    const options = this.language === "hi" ? question.optionsHi : question.options
    options.forEach((option, index) => {
      const optionDiv = document.createElement("div")
      optionDiv.className = "form-check quiz-option p-2 rounded mb-2"
      optionDiv.innerHTML = `
                <input class="form-check-input" type="radio" name="quizOption" id="option${index}" value="${index}">
                <label class="form-check-label w-100" for="option${index}">
                    ${option}
                </label>
            `

      optionDiv.addEventListener("click", () => {
        this.selectOption(index, optionDiv)
      })

      optionsContainer.appendChild(optionDiv)
    })

    submitBtn.disabled = true
    document.getElementById("quizResult").classList.add("d-none")
    document.getElementById("questionCard").classList.remove("d-none")
  }

  selectOption(index, optionElement) {
    // Remove previous selection
    document.querySelectorAll(".quiz-option").forEach((opt) => {
      opt.classList.remove("selected")
    })

    // Select current option
    optionElement.classList.add("selected")
    document.getElementById(`option${index}`).checked = true
    this.selectedAnswer = index
    document.getElementById("submitAnswer").disabled = false
  }

  submitAnswer() {
    if (this.selectedAnswer === null) return

    const question = this.questions[this.currentQuestion]
    const isCorrect = this.selectedAnswer === question.correct

    if (isCorrect) {
      this.score++
    }

    // Show correct/incorrect styling
    document.querySelectorAll(".quiz-option").forEach((opt, index) => {
      if (index === question.correct) {
        opt.classList.add("correct")
      } else if (index === this.selectedAnswer && !isCorrect) {
        opt.classList.add("incorrect")
      }
    })

    // Show result
    setTimeout(() => {
      this.showResult(isCorrect, question)
    }, 1000)
  }

  showResult(isCorrect, question) {
    document.getElementById("questionCard").classList.add("d-none")
    document.getElementById("quizResult").classList.remove("d-none")

    const resultMessage = document.getElementById("resultMessage")
    const explanation = this.language === "hi" ? question.explanationHi : question.explanation

    if (isCorrect) {
      resultMessage.innerHTML = `
                <div class="text-success">
                    <i class="fas fa-check-circle fa-2x mb-2"></i>
                    <div>Correct!</div>
                    <small class="text-muted">${explanation}</small>
                </div>
            `
    } else {
      resultMessage.innerHTML = `
                <div class="text-danger">
                    <i class="fas fa-times-circle fa-2x mb-2"></i>
                    <div>Incorrect!</div>
                    <small class="text-muted">${explanation}</small>
                </div>
            `
    }
  }

  nextQuestion() {
    this.currentQuestion++

    if (this.currentQuestion < this.questions.length) {
      this.selectedAnswer = null
      this.showQuestion()
    } else {
      this.endQuiz()
    }
  }

  endQuiz() {
    const percentage = Math.round((this.score / this.questions.length) * 100)
    let message = ""

    if (percentage >= 80) {
      this.updateStreak(true)
      message =
        this.language === "hi"
          ? `बहुत बढ़िया! आपने ${this.score}/${this.questions.length} सही उत्तर दिए।`
          : `Excellent! You scored ${this.score}/${this.questions.length} correct answers.`
    } else {
      this.updateStreak(false)
      message =
        this.language === "hi"
          ? `अच्छी कोशिश! आपने ${this.score}/${this.questions.length} सही उत्तर दिए। और अभ्यास करें।`
          : `Good try! You scored ${this.score}/${this.questions.length} correct answers. Keep practicing!`
    }

    document.getElementById("resultMessage").innerHTML = `
            <div class="text-center">
                <h4>${message}</h4>
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="location.reload()">
                        ${this.language === "hi" ? "फिर से खेलें" : "Play Again"}
                    </button>
                </div>
            </div>
        `

    document.getElementById("nextQuestion").style.display = "none"
    this.updateQuizStats()
  }

  getStreak() {
    return Number.parseInt(localStorage.getItem("jansuraksha_quiz_streak") || "0")
  }

  updateStreak(passed) {
    if (passed) {
      this.streak++
    } else {
      this.streak = 0
    }
    localStorage.setItem("jansuraksha_quiz_streak", this.streak.toString())
  }

  loadQuizStats() {
    const totalScore = localStorage.getItem("jansuraksha_total_score") || "0"
    const badgeCount = this.calculateBadges()

    document.getElementById("streakCount").textContent = this.streak
    document.getElementById("totalScore").textContent = totalScore
    document.getElementById("badgeCount").textContent = badgeCount
  }

  updateQuizStats() {
    const currentTotal = Number.parseInt(localStorage.getItem("jansuraksha_total_score") || "0")
    const newTotal = currentTotal + this.score
    localStorage.setItem("jansuraksha_total_score", newTotal.toString())

    this.loadQuizStats()
  }

  calculateBadges() {
    let badges = 0
    if (this.streak >= 3) badges++
    if (this.streak >= 5) badges++
    if (this.streak >= 10) badges++
    return badges
  }

  setLanguage(language) {
    this.language = language
  }
}
