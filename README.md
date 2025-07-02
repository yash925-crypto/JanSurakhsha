# JanSuraksha AI - Emergency Assistant Platform

🛡️ **JanSuraksha AI** is a comprehensive web-based emergency assistant platform designed specifically for Indian citizens. It provides AI-powered guidance, voice support, location services, and safety resources during real-life disasters and emergencies.

## 🌟 Features

### 1. AI-Powered Emergency Assistant
- **Smart Response System**: Uses keyword detection to provide appropriate emergency instructions
- **Multilingual Support**: Available in Hindi and English
- **Voice Input**: Speak your emergency situation for hands-free operation
- **Text-to-Speech**: AI responses are read aloud for accessibility

### 2. Emergency QR ID Generator
- **Personal Emergency Card**: Generate QR codes with medical and contact information
- **Downloadable & Printable**: Save or print emergency ID cards
- **Essential Information**: Name, blood group, emergency contacts, allergies, and medical notes

### 3. SOS Location Sharing
- **One-Touch SOS**: Send emergency location via WhatsApp or SMS
- **GPS Integration**: Automatically includes Google Maps location link
- **Multiple Sharing Options**: WhatsApp, SMS, or copy to clipboard

### 4. Real-time Help Map
- **Google Maps Integration**: Find nearby hospitals, police stations, and fire stations
- **Location-Based Search**: Automatically shows help centers within 5km radius
- **Direct Navigation**: Get directions and contact information for emergency services

### 5. Voice Instruction Support
- **Text-to-Speech Engine**: Reads safety instructions aloud
- **Language Selection**: Supports Hindi and English voice output
- **Accessibility**: Helps users with visual impairments or in low-light conditions

### 6. Safety Guides & Resources
- **Comprehensive Guides**: Earthquake, flood, fire, and cyclone safety instructions
- **Printable Guides**: Download and print safety manuals for offline use
- **Step-by-Step Instructions**: Clear, actionable safety procedures

### 7. Gamified Safety Quiz
- **Daily Quiz**: Test your emergency preparedness knowledge
- **Streak Tracking**: Maintain learning streaks with badge rewards
- **Multilingual Questions**: Available in Hindi and English
- **Progress Tracking**: Monitor your safety knowledge improvement

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for maps and external services
- Location services enabled for GPS features

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/jansuraksha-ai.git
   cd jansuraksha-ai
   \`\`\`

2. **Set up Google Maps API**
   - Get a Google Maps JavaScript API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
     - Geolocation API
   - Add your API key to the HTML file:
   \`\`\`html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
   \`\`\`

3. **Serve the application**
   \`\`\`bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   \`\`\`

4. **Access the application**
   Open your browser and navigate to `http://localhost:8000`

## 📱 PWA Installation

JanSuraksha AI is a Progressive Web App (PWA) that can be installed on mobile devices:

1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option
3. Follow the installation prompts
4. Access the app from your home screen like a native app

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5
- **JavaScript**: Vanilla ES6+ modules
- **Maps**: Google Maps JavaScript API
- **QR Codes**: qrcode.js library
- **Voice**: Web Speech API (SpeechSynthesis & SpeechRecognition)
- **PWA**: Service Worker for offline functionality
- **Storage**: LocalStorage for user preferences and data

## 📂 Project Structure

\`\`\`
jansuraksha-ai/
├── index.html              # Main application page
├── manifest.json           # PWA manifest
├── sw.js                  # Service worker for offline support
├── css/
│   └── styles.css         # Custom styles and responsive design
├── js/
│   ├── main.js           # Main application logic
│   ├── ai-response-engine.js  # AI response system
│   ├── qr-generator.js   # QR code generation
│   └── quiz.js           # Safety quiz functionality
├── maps/
│   └── location-mapper.js # Google Maps integration
├── voice/
│   └── tts.js            # Text-to-speech engine
├── data/
│   └── response-rules.json # AI response rules and data
└── README.md
\`\`\`

## 🔧 Configuration

### Environment Variables
The application uses the following configuration:

- **Google Maps API Key**: Required for maps and location services
- **Language Settings**: Stored in localStorage
- **User Preferences**: Cached locally for offline access

### Customization
You can customize the application by:

1. **Adding new emergency types**: Edit `data/response-rules.json`
2. **Modifying UI colors**: Update CSS custom properties in `css/styles.css`
3. **Adding new languages**: Extend the language system in `js/main.js`
4. **Custom safety guides**: Add new guides in the safety guides modal

## 🌐 Browser Support

- **Chrome/Chromium**: Full support including voice features
- **Firefox**: Full support with limited voice recognition
- **Safari**: Full support on iOS with some voice limitations
- **Edge**: Full support including all voice features

## 📱 Mobile Features

- **Responsive Design**: Optimized for mobile-first usage
- **Touch-Friendly**: Large buttons and touch targets
- **Offline Support**: Core functionality works without internet
- **GPS Integration**: Uses device location services
- **Voice Commands**: Hands-free operation support

## 🔒 Privacy & Security

- **Local Storage**: All personal data stored locally on device
- **No Server**: No personal information sent to external servers
- **Location Privacy**: GPS coordinates only used for emergency sharing
- **Offline First**: Core features work without internet connection

## 🤝 Contributing

We welcome contributions to improve JanSuraksha AI:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ES6+ JavaScript standards
- Maintain mobile-first responsive design
- Test across different browsers and devices
- Ensure accessibility compliance
- Add appropriate comments and documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Emergency Numbers (India)

- **Police**: 100
- **Fire**: 101
- **Ambulance**: 108
- **Disaster Management**: 1078
- **Women Helpline**: 1091
- **Child Helpline**: 1098

## 🙏 Acknowledgments

- **Bootstrap**: For responsive UI components
- **Google Maps**: For location and mapping services
- **Font Awesome**: For icons and visual elements
- **QRCode.js**: For QR code generation
- **Web Speech API**: For voice functionality

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@jansuraksha-ai.com
- Emergency: Always call local emergency services first

---

**Remember**: JanSuraksha AI is a supplementary tool. In real emergencies, always contact local emergency services immediately.

🛡️ **Stay Safe, Stay Prepared with JanSuraksha AI**
