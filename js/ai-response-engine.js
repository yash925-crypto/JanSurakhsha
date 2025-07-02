export class AIResponseEngine {
  constructor() {
    this.rules = null
    this.responses = null
  }

  async loadRules() {
    try {
      const response = await fetch("data/response-rules.json")
      const data = await response.json()
      this.rules = data.rules
      this.responses = data.responses
    } catch (error) {
      console.error("Error loading AI rules:", error)
      this.loadFallbackRules()
    }
  }

  loadFallbackRules() {
    // Fallback rules in case JSON file fails to load
    this.rules = [
      {
        keywords: ["fire", "आग", "burning", "smoke", "धुआं"],
        category: "fire",
        priority: "high",
      },
      {
        keywords: ["earthquake", "भूकंप", "tremor", "shaking", "हिलना"],
        category: "earthquake",
        priority: "high",
      },
      {
        keywords: ["flood", "बाढ़", "water", "पानी", "drowning", "डूबना"],
        category: "flood",
        priority: "high",
      },
      {
        keywords: ["medical", "चिकित्सा", "heart attack", "दिल का दौरा", "unconscious", "बेहोश"],
        category: "medical",
        priority: "critical",
      },
      {
        keywords: ["gas", "गैस", "leak", "रिसाव", "smell", "गंध"],
        category: "gas",
        priority: "high",
      },
    ]

    this.responses = {
      fire: {
        en: {
          immediate: "🔥 FIRE EMERGENCY - Act immediately!",
          steps: [
            "1. GET OUT immediately and stay out",
            "2. Call Fire Department: 101",
            "3. If trapped, close doors between you and fire",
            "4. Signal for help from window",
            "5. Crawl low under smoke",
            "6. Feel doors before opening - if hot, don't open",
          ],
          warning: "⚠️ Never go back inside a burning building!",
        },
        hi: {
          immediate: "🔥 आग की आपातकाल - तुरंत कार्य करें!",
          steps: [
            "1. तुरंत बाहर निकलें और बाहर ही रहें",
            "2. फायर डिपार्टमेंट को कॉल करें: 101",
            "3. यदि फंस गए हैं, तो अपने और आग के बीच दरवाजे बंद करें",
            "4. खिड़की से मदद के लिए संकेत दें",
            "5. धुएं के नीचे रेंगकर चलें",
            "6. दरवाजे खोलने से पहले महसूस करें - यदि गर्म है, तो न खोलें",
          ],
          warning: "⚠️ जलती हुई इमारत में कभी वापस न जाएं!",
        },
      },
      earthquake: {
        en: {
          immediate: "🏠 EARTHQUAKE - Drop, Cover, Hold On!",
          steps: [
            "1. DROP to hands and knees",
            "2. Take COVER under desk/table",
            "3. HOLD ON to your shelter",
            "4. If outdoors, move away from buildings",
            "5. If in car, pull over and stop",
            "6. After shaking stops, evacuate if building damaged",
          ],
          warning: "⚠️ Expect aftershocks - be prepared to take cover again!",
        },
        hi: {
          immediate: "🏠 भूकंप - गिरें, छुपें, पकड़ें!",
          steps: [
            "1. हाथों और घुटनों के बल गिरें",
            "2. मेज/टेबल के नीचे छुपें",
            "3. अपने आश्रय को कसकर पकड़ें",
            "4. यदि बाहर हैं, तो इमारतों से दूर जाएं",
            "5. यदि कार में हैं, तो रोकें",
            "6. हिलना बंद होने के बाद, यदि इमारत क्षतिग्रस्त है तो निकलें",
          ],
          warning: "⚠️ बाद के झटकों की अपेक्षा करें - फिर से छुपने के लिए तैयार रहें!",
        },
      },
      flood: {
        en: {
          immediate: "🌊 FLOOD WARNING - Move to higher ground NOW!",
          steps: [
            "1. Move to higher ground immediately",
            "2. Avoid walking/driving through flood water",
            "3. Turn off electricity at main breaker",
            "4. Listen to emergency broadcasts",
            "5. If trapped, go to highest floor",
            "6. Signal for help from roof/window",
          ],
          warning: "⚠️ Just 6 inches of moving water can knock you down!",
        },
        hi: {
          immediate: "🌊 बाढ़ की चेतावनी - अभी ऊंची जगह पर जाएं!",
          steps: [
            "1. तुरंत ऊंची जगह पर जाएं",
            "2. बाढ़ के पानी में चलने/गाड़ी चलाने से बचें",
            "3. मुख्य ब्रेकर पर बिजली बंद करें",
            "4. आपातकालीन प्रसारण सुनें",
            "5. यदि फंस गए हैं, तो सबसे ऊंची मंजिल पर जाएं",
            "6. छत/खिड़की से मदद के लिए संकेत दें",
          ],
          warning: "⚠️ केवल 6 इंच बहता पानी आपको गिरा सकता है!",
        },
      },
      medical: {
        en: {
          immediate: "🚑 MEDICAL EMERGENCY - Call 108 immediately!",
          steps: [
            "1. Call ambulance: 108",
            "2. Check if person is conscious",
            "3. If unconscious, check breathing",
            "4. If not breathing, start CPR",
            "5. Keep person warm and comfortable",
            "6. Don't give food or water",
          ],
          warning: "⚠️ Don't move person unless in immediate danger!",
        },
        hi: {
          immediate: "🚑 चिकित्सा आपातकाल - तुरंत 108 पर कॉल करें!",
          steps: [
            "1. एम्बुलेंस को कॉल करें: 108",
            "2. जांचें कि व्यक्ति होश में है या नहीं",
            "3. यदि बेहोश है, तो सांस की जांच करें",
            "4. यदि सांस नहीं ले रहा, तो CPR शुरू करें",
            "5. व्यक्ति को गर्म और आरामदायक रखें",
            "6. खाना या पानी न दें",
          ],
          warning: "⚠️ तत्काल खतरे में न हो तो व्यक्ति को न हिलाएं!",
        },
      },
      gas: {
        en: {
          immediate: "⚠️ GAS LEAK - Evacuate immediately!",
          steps: [
            "1. Don't use electrical switches or phones",
            "2. Don't light matches or lighters",
            "3. Open windows and doors",
            "4. Turn off gas supply if safe to do so",
            "5. Evacuate the area immediately",
            "6. Call gas company from safe location",
          ],
          warning: "⚠️ Even small sparks can cause explosion!",
        },
        hi: {
          immediate: "⚠️ गैस रिसाव - तुरंत निकलें!",
          steps: [
            "1. बिजली के स्विच या फोन का उपयोग न करें",
            "2. माचिस या लाइटर न जलाएं",
            "3. खिड़कियां और दरवाजे खोलें",
            "4. यदि सुरक्षित हो तो गैस सप्लाई बंद करें",
            "5. तुरंत क्षेत्र से निकलें",
            "6. सुरक्षित स्थान से गैस कंपनी को कॉल करें",
          ],
          warning: "⚠️ छोटी चिंगारी भी विस्फोट का कारण बन सकती है!",
        },
      },
    }
  }

  async getResponse(query, language = "en") {
    if (!this.rules || !this.responses) {
      await this.loadRules()
    }

    const detectedCategory = this.detectEmergency(query.toLowerCase())

    if (detectedCategory) {
      return this.formatResponse(detectedCategory, language)
    } else {
      return this.getGeneralResponse(language)
    }
  }

  detectEmergency(query) {
    for (const rule of this.rules) {
      for (const keyword of rule.keywords) {
        if (query.includes(keyword.toLowerCase())) {
          return rule.category
        }
      }
    }
    return null
  }

  formatResponse(category, language) {
    const response = this.responses[category]
    if (!response || !response[language]) {
      return this.getGeneralResponse(language)
    }

    const data = response[language]
    let formattedResponse = `<div class="emergency-response">`
    formattedResponse += `<h5 class="text-danger mb-3">${data.immediate}</h5>`
    formattedResponse += `<div class="steps mb-3">`

    data.steps.forEach((step) => {
      formattedResponse += `<div class="step mb-2 p-2 bg-light rounded">${step}</div>`
    })

    formattedResponse += `</div>`
    formattedResponse += `<div class="alert alert-warning mb-0">${data.warning}</div>`
    formattedResponse += `</div>`

    return formattedResponse
  }

  getGeneralResponse(language) {
    const responses = {
      en: `
                <div class="general-response">
                    <h5 class="text-primary mb-3">🆘 General Emergency Guidance</h5>
                    <div class="mb-3">
                        <strong>Emergency Numbers:</strong><br>
                        • Police: 100<br>
                        • Fire: 101<br>
                        • Ambulance: 108<br>
                        • Disaster Management: 1078
                    </div>
                    <div class="alert alert-info">
                        For specific emergency guidance, please describe your situation using keywords like "fire", "earthquake", "flood", "medical emergency", etc.
                    </div>
                </div>
            `,
      hi: `
                <div class="general-response">
                    <h5 class="text-primary mb-3">🆘 सामान्य आपातकालीन मार्गदर्शन</h5>
                    <div class="mb-3">
                        <strong>आपातकालीन नंबर:</strong><br>
                        • पुलिस: 100<br>
                        • फायर: 101<br>
                        • एम्बुलेंस: 108<br>
                        • आपदा प्रबंधन: 1078
                    </div>
                    <div class="alert alert-info">
                        विशिष्ट आपातकालीन मार्गदर्शन के लिए, कृपया "आग", "भूकंप", "बाढ़", "चिकित्सा आपातकाल" आदि जैसे शब्दों का उपयोग करके अपनी स्थिति का वर्णन करें।
                    </div>
                </div>
            `,
    }

    return responses[language] || responses.en
  }
}
