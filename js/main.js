// Main JavaScript file for JanSuraksha AI
import { AIResponseEngine } from "./ai-response-engine.js"
import { QRGenerator } from "./qr-generator.js"
import { LocationMapper } from "../maps/location-mapper.js"
import { TTSEngine } from "../voice/tts.js"
import { QuizEngine } from "./quiz.js"
import bootstrap from "bootstrap" // Declare the bootstrap variable

class JanSurakshaAI {
  constructor() {
    this.currentLanguage = "en"
    this.aiEngine = new AIResponseEngine()
    this.qrGenerator = new QRGenerator()
    this.locationMapper = new LocationMapper()
    this.ttsEngine = new TTSEngine()
    this.quizEngine = new QuizEngine()

    this.init()
  }

  async init() {
    await this.aiEngine.loadRules()
    this.setupEventListeners()
    this.initializeMap()
    this.updateLanguage()
    this.loadUserData()
  }

  setupEventListeners() {
    // Language Toggle
    document.getElementById("languageToggle").addEventListener("click", () => {
      this.toggleLanguage()
    })

    // SOS Button
    document.getElementById("sosButton").addEventListener("click", () => {
      this.sendSOS()
    })

    // AI Assistant
    document.getElementById("askAI").addEventListener("click", () => {
      this.handleAIQuery()
    })

    document.getElementById("emergencyInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleAIQuery()
      }
    })

    // Voice Input
    document.getElementById("voiceInput").addEventListener("click", () => {
      this.startVoiceInput()
    })

    // Speak Response
    document.getElementById("speakResponse").addEventListener("click", () => {
      this.speakAIResponse()
    })

    // Find Help Button
    document.getElementById("findHelpBtn").addEventListener("click", () => {
      this.findNearbyHelp()
    })

    // Emergency Form
    document.getElementById("emergencyForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.generateEmergencyQR()
    })

    // QR Actions
    document.getElementById("downloadQR").addEventListener("click", () => {
      this.qrGenerator.downloadQR()
    })

    document.getElementById("printQR").addEventListener("click", () => {
      this.qrGenerator.printQR()
    })

    // Safety Guides
    document.querySelectorAll("[data-guide]").forEach((guide) => {
      guide.addEventListener("click", (e) => {
        e.preventDefault()
        this.openSafetyGuide(guide.dataset.guide)
      })
    })

    // Quiz Modal Events
    document.getElementById("quizModal").addEventListener("shown.bs.modal", () => {
      this.quizEngine.startQuiz()
    })
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === "en" ? "hi" : "en"
    this.updateLanguage()
    localStorage.setItem("jansuraksha_language", this.currentLanguage)
  }

  updateLanguage() {
    const elements = document.querySelectorAll("[data-en][data-hi]")
    const langText = document.getElementById("langText")

    elements.forEach((element) => {
      const text = element.getAttribute(`data-${this.currentLanguage}`)
      if (text) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = text
        } else {
          element.textContent = text
        }
      }
    })

    langText.textContent = this.currentLanguage === "en" ? "हिंदी" : "English"
    this.ttsEngine.setLanguage(this.currentLanguage)
  }

  async sendSOS() {
    const sosButton = document.getElementById("sosButton")
    const originalText = sosButton.innerHTML

    sosButton.innerHTML = '<div class="loading-spinner"></div> Sending...'
    sosButton.disabled = true

    try {
      const position = await this.getCurrentPosition()
      const { latitude, longitude } = position.coords

      const message =
        this.currentLanguage === "hi"
          ? `आपातकाल! मुझे सहायता की आवश्यकता है। मेरा स्थान: https://maps.google.com/?q=${latitude},${longitude}`
          : `EMERGENCY! I need help. My location: https://maps.google.com/?q=${latitude},${longitude}`

      // Share via WhatsApp or SMS
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      const smsUrl = `sms:?body=${encodeURIComponent(message)}`

      // Show options to user
      this.showSOSOptions(whatsappUrl, smsUrl, message)
    } catch (error) {
      console.error("Error sending SOS:", error)
      alert(
        this.currentLanguage === "hi" ? "SOS भेजने में त्रुटि। कृपया पुनः प्रयास करें।" : "Error sending SOS. Please try again.",
      )
    } finally {
      sosButton.innerHTML = originalText
      sosButton.disabled = false
    }
  }

  showSOSOptions(whatsappUrl, smsUrl, message) {
    const modal = document.createElement("div")
    modal.className = "modal fade"
    modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">Send SOS</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-4">Choose how to send your emergency message:</p>
                        <div class="d-grid gap-2">
                            <a href="${whatsappUrl}" class="btn btn-success btn-lg" target="_blank">
                                <i class="fab fa-whatsapp me-2"></i>Send via WhatsApp
                            </a>
                            <a href="${smsUrl}" class="btn btn-primary btn-lg">
                                <i class="fas fa-sms me-2"></i>Send via SMS
                            </a>
                            <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${message}')">
                                <i class="fas fa-copy me-2"></i>Copy Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `

    document.body.appendChild(modal)
    const bsModal = new bootstrap.Modal(modal)
    bsModal.show()

    modal.addEventListener("hidden.bs.modal", () => {
      document.body.removeChild(modal)
    })
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      })
    })
  }

  async handleAIQuery() {
    const input = document.getElementById("emergencyInput")
    const query = input.value.trim()

    if (!query) return

    const responseBox = document.getElementById("aiResponse")
    const responseText = document.getElementById("responseText")

    responseBox.classList.remove("d-none")
    responseText.innerHTML = '<div class="loading-spinner"></div> Processing...'

    try {
      const response = await this.aiEngine.getResponse(query, this.currentLanguage)
      responseText.innerHTML = response

      // Auto-speak if enabled
      if (this.ttsEngine.isEnabled()) {
        setTimeout(() => this.speakAIResponse(), 500)
      }
    } catch (error) {
      console.error("AI Response Error:", error)
      responseText.innerHTML =
        this.currentLanguage === "hi"
          ? "क्षमा करें, मैं इस समय आपकी सहायता नहीं कर सकता।"
          : "Sorry, I cannot help you at this moment."
    }
  }

  startVoiceInput() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = this.currentLanguage === "hi" ? "hi-IN" : "en-US"
    recognition.continuous = false
    recognition.interimResults = false

    const voiceBtn = document.getElementById("voiceInput")
    voiceBtn.innerHTML = '<i class="fas fa-stop"></i>'
    voiceBtn.classList.add("btn-danger")

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      document.getElementById("emergencyInput").value = transcript
      this.handleAIQuery()
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
    }

    recognition.onend = () => {
      voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>'
      voiceBtn.classList.remove("btn-danger")
    }

    recognition.start()
  }

  speakAIResponse() {
    const responseText = document.getElementById("responseText").textContent
    this.ttsEngine.speak(responseText)
  }

  async initializeMap() {
    try {
      await this.locationMapper.initMap("map")
      const position = await this.getCurrentPosition()
      this.locationMapper.showNearbyHelp(position.coords.latitude, position.coords.longitude)
    } catch (error) {
      console.error("Map initialization error:", error)
      document.getElementById("map").innerHTML =
        '<div class="text-center p-4">Map not available. Please enable location services.</div>'
    }
  }

  async findNearbyHelp() {
    try {
      const position = await this.getCurrentPosition()
      this.locationMapper.showNearbyHelp(position.coords.latitude, position.coords.longitude)

      // Scroll to map
      document.getElementById("map").scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      alert("Unable to get your location. Please enable location services.")
    }
  }

  generateEmergencyQR() {
    const formData = {
      name: document.getElementById("fullName").value,
      bloodGroup: document.getElementById("bloodGroup").value,
      emergencyContact: document.getElementById("emergencyContact").value,
      age: document.getElementById("age").value,
      allergies: document.getElementById("allergies").value,
      notes: document.getElementById("notes").value,
      generated: new Date().toISOString(),
    }

    this.qrGenerator.generateQR(formData)

    // Save to localStorage
    localStorage.setItem("jansuraksha_emergency_data", JSON.stringify(formData))
  }

  openSafetyGuide(guideType) {
    const guides = {
      earthquake: {
        title: "Earthquake Safety Guide",
        content: `
                    <h6>Before an Earthquake:</h6>
                    <ul>
                        <li>Secure heavy furniture and appliances</li>
                        <li>Keep emergency supplies ready</li>
                        <li>Know safe spots in each room</li>
                    </ul>
                    <h6>During an Earthquake:</h6>
                    <ul>
                        <li>Drop, Cover, and Hold On</li>
                        <li>Stay away from windows and heavy objects</li>
                        <li>If outdoors, move away from buildings</li>
                    </ul>
                    <h6>After an Earthquake:</h6>
                    <ul>
                        <li>Check for injuries and hazards</li>
                        <li>Be prepared for aftershocks</li>
                        <li>Listen to emergency broadcasts</li>
                    </ul>
                `,
      },
      flood: {
        title: "Flood Safety Guide",
        content: `
                    <h6>Before a Flood:</h6>
                    <ul>
                        <li>Know your evacuation routes</li>
                        <li>Keep important documents in waterproof container</li>
                        <li>Have emergency supplies ready</li>
                    </ul>
                    <h6>During a Flood:</h6>
                    <ul>
                        <li>Move to higher ground immediately</li>
                        <li>Avoid walking or driving through flood water</li>
                        <li>Stay away from electrical equipment</li>
                    </ul>
                    <h6>After a Flood:</h6>
                    <ul>
                        <li>Wait for authorities to declare area safe</li>
                        <li>Avoid flood water - it may be contaminated</li>
                        <li>Document damage for insurance</li>
                    </ul>
                `,
      },
      fire: {
        title: "Fire Safety Guide",
        content: `
                    <h6>Fire Prevention:</h6>
                    <ul>
                        <li>Install smoke detectors</li>
                        <li>Keep fire extinguishers accessible</li>
                        <li>Plan and practice escape routes</li>
                    </ul>
                    <h6>During a Fire:</h6>
                    <ul>
                        <li>Get out fast and stay out</li>
                        <li>Crawl low under smoke</li>
                        <li>Feel doors before opening</li>
                    </ul>
                    <h6>If Trapped:</h6>
                    <ul>
                        <li>Close doors between you and fire</li>
                        <li>Signal for help from window</li>
                        <li>Wait for rescue - don't jump</li>
                    </ul>
                `,
      },
      cyclone: {
        title: "Cyclone Safety Guide",
        content: `
                    <h6>Before a Cyclone:</h6>
                    <ul>
                        <li>Monitor weather updates</li>
                        <li>Secure outdoor items</li>
                        <li>Stock emergency supplies</li>
                    </ul>
                    <h6>During a Cyclone:</h6>
                    <ul>
                        <li>Stay indoors in strongest part of building</li>
                        <li>Keep away from windows</li>
                        <li>Listen to battery-powered radio</li>
                    </ul>
                    <h6>After a Cyclone:</h6>
                    <ul>
                        <li>Wait for all-clear from authorities</li>
                        <li>Watch for flooding and debris</li>
                        <li>Avoid damaged power lines</li>
                    </ul>
                `,
      },
    }

    const guide = guides[guideType]
    if (guide) {
      const modal = document.createElement("div")
      modal.className = "modal fade"
      modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title">${guide.title}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${guide.content}
                            <div class="mt-3">
                                <button class="btn btn-success" onclick="this.closest('.modal-content').querySelector('.modal-body').innerHTML = this.closest('.modal-content').querySelector('.modal-body').innerHTML; window.print();">
                                    <i class="fas fa-print me-1"></i>Print Guide
                                </button>
                                <button class="btn btn-primary ms-2" onclick="window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.closest('.modal-content').querySelector('.modal-body').textContent))">
                                    <i class="fas fa-volume-up me-1"></i>Read Aloud
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `

      document.body.appendChild(modal)
      const bsModal = new bootstrap.Modal(modal)
      bsModal.show()

      modal.addEventListener("hidden.bs.modal", () => {
        document.body.removeChild(modal)
      })
    }
  }

  loadUserData() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("jansuraksha_language")
    if (savedLanguage) {
      this.currentLanguage = savedLanguage
      this.updateLanguage()
    }

    // Load saved emergency data
    const savedData = localStorage.getItem("jansuraksha_emergency_data")
    if (savedData) {
      const data = JSON.parse(savedData)
      document.getElementById("fullName").value = data.name || ""
      document.getElementById("bloodGroup").value = data.bloodGroup || ""
      document.getElementById("emergencyContact").value = data.emergencyContact || ""
      document.getElementById("age").value = data.age || ""
      document.getElementById("allergies").value = data.allergies || ""
      document.getElementById("notes").value = data.notes || ""
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new JanSurakshaAI()
})

// Service Worker Registration for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
