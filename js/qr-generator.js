import QRCode from "qrcode"

export class QRGenerator {
  constructor() {
    this.currentQRData = null
  }

  async generateQR(userData) {
    try {
      // Create QR data
      const qrData = {
        type: "JanSuraksha Emergency ID",
        name: userData.name,
        bloodGroup: userData.bloodGroup,
        emergencyContact: userData.emergencyContact,
        age: userData.age,
        allergies: userData.allergies,
        notes: userData.notes,
        generated: userData.generated,
      }

      this.currentQRData = qrData

      // Generate QR code
      const qrContainer = document.getElementById("qrcode")
      qrContainer.innerHTML = ""

      await QRCode.toCanvas(qrContainer, JSON.stringify(qrData), {
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      })

      // Show result section
      document.getElementById("qrResult").classList.remove("d-none")

      // Create printable card
      this.createPrintableCard(userData, qrContainer.querySelector("canvas"))
    } catch (error) {
      console.error("Error generating QR code:", error)
      alert("Error generating QR code. Please try again.")
    }
  }

  createPrintableCard(userData, qrCanvas) {
    const card = document.createElement("div")
    card.id = "printableCard"
    card.className = "printable-card"
    card.style.display = "none"

    card.innerHTML = `
            <div style="width: 350px; border: 2px solid #dc3545; border-radius: 10px; padding: 20px; background: white; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h3 style="color: #dc3545; margin: 0;">🛡️ JanSuraksha AI</h3>
                    <p style="margin: 5px 0; font-size: 14px; color: #666;">Emergency ID Card</p>
                </div>
                
                <div style="display: flex; gap: 15px;">
                    <div style="flex: 1;">
                        <div style="margin-bottom: 8px;"><strong>Name:</strong> ${userData.name}</div>
                        <div style="margin-bottom: 8px;"><strong>Age:</strong> ${userData.age}</div>
                        <div style="margin-bottom: 8px;"><strong>Blood Group:</strong> ${userData.bloodGroup}</div>
                        <div style="margin-bottom: 8px;"><strong>Emergency Contact:</strong> ${userData.emergencyContact}</div>
                        ${userData.allergies ? `<div style="margin-bottom: 8px;"><strong>Allergies:</strong> ${userData.allergies}</div>` : ""}
                        ${userData.notes ? `<div style="margin-bottom: 8px;"><strong>Notes:</strong> ${userData.notes}</div>` : ""}
                    </div>
                    <div style="text-align: center;">
                        <div id="cardQR"></div>
                        <p style="font-size: 10px; margin: 5px 0;">Scan for emergency info</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee; font-size: 10px; color: #666;">
                    Generated: ${new Date(userData.generated).toLocaleDateString()}
                </div>
            </div>
        `

    document.body.appendChild(card)

    // Add QR code to card
    const cardQRContainer = card.querySelector("#cardQR")
    const clonedCanvas = qrCanvas.cloneNode(true)
    clonedCanvas.style.width = "80px"
    clonedCanvas.style.height = "80px"
    cardQRContainer.appendChild(clonedCanvas)
  }

  downloadQR() {
    if (!this.currentQRData) return

    const canvas = document.querySelector("#qrcode canvas")
    if (canvas) {
      const link = document.createElement("a")
      link.download = `jansuraksha-emergency-id-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  printQR() {
    const printableCard = document.getElementById("printableCard")
    if (printableCard) {
      const printWindow = window.open("", "_blank")
      printWindow.document.write(`
                <html>
                    <head>
                        <title>JanSuraksha Emergency ID</title>
                        <style>
                            body { margin: 0; padding: 20px; }
                            @media print {
                                body { margin: 0; }
                            }
                        </style>
                    </head>
                    <body>
                        ${printableCard.innerHTML}
                    </body>
                </html>
            `)
      printWindow.document.close()
      printWindow.print()
    }
  }
}
