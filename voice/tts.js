export class TTSEngine {
  constructor() {
    this.synth = window.speechSynthesis
    this.voices = []
    this.currentLanguage = "en"
    this.enabled = true

    this.loadVoices()

    // Load voices when they become available
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices()
    }
  }

  loadVoices() {
    this.voices = this.synth.getVoices()
  }

  setLanguage(language) {
    this.currentLanguage = language
  }

  isEnabled() {
    return this.enabled
  }

  setEnabled(enabled) {
    this.enabled = enabled
  }

  speak(text) {
    if (!this.enabled || !text) return

    // Cancel any ongoing speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Set language-specific voice
    const voice = this.voices.find((v) =>
      this.currentLanguage === "hi" ? v.lang.startsWith("hi") : v.lang.startsWith("en"),
    )

    if (voice) {
      utterance.voice = voice
    }

    utterance.lang = this.currentLanguage === "hi" ? "hi-IN" : "en-US"
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    this.synth.speak(utterance)
  }

  stop() {
    this.synth.cancel()
  }
}
