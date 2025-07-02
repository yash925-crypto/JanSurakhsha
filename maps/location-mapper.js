import { google } from "google-maps"

export class LocationMapper {
  constructor() {
    this.map = null
    this.userMarker = null
    this.helpMarkers = []
  }

  async initMap(containerId) {
    // Initialize map with default location (India center)
    const defaultLocation = { lat: 20.5937, lng: 78.9629 }

    this.map = new google.maps.Map(document.getElementById(containerId), {
      zoom: 10,
      center: defaultLocation,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })

    // Try to get user's location
    try {
      const position = await this.getCurrentPosition()
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      this.map.setCenter(userLocation)
      this.addUserMarker(userLocation)
      this.showNearbyHelp(userLocation.lat, userLocation.lng)
    } catch (error) {
      console.log("Could not get user location, using default")
    }
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

  addUserMarker(location) {
    if (this.userMarker) {
      this.userMarker.setMap(null)
    }

    this.userMarker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: "Your Location",
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="8" fill="#4285f4" stroke="white" stroke-width="2"/>
                        <circle cx="16" cy="16" r="3" fill="white"/>
                    </svg>
                `),
        scaledSize: new google.maps.Size(32, 32),
      },
    })
  }

  async showNearbyHelp(lat, lng) {
    // Clear existing markers
    this.helpMarkers.forEach((marker) => marker.setMap(null))
    this.helpMarkers = []

    const helpTypes = [
      { type: "hospital", name: "Hospitals", icon: "🏥", color: "#dc3545" },
      { type: "police", name: "Police Stations", icon: "👮", color: "#0d6efd" },
      { type: "fire_station", name: "Fire Stations", icon: "🚒", color: "#fd7e14" },
    ]

    for (const helpType of helpTypes) {
      await this.findNearbyPlaces(lat, lng, helpType)
    }
  }

  async findNearbyPlaces(lat, lng, helpType) {
    const service = new google.maps.places.PlacesService(this.map)

    const request = {
      location: new google.maps.LatLng(lat, lng),
      radius: 5000, // 5km radius
      type: helpType.type,
    }

    return new Promise((resolve) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          results.slice(0, 5).forEach((place) => {
            this.addHelpMarker(place, helpType)
          })
        }
        resolve()
      })
    })
  }

  addHelpMarker(place, helpType) {
    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map: this.map,
      title: place.name,
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="12" fill="${helpType.color}" stroke="white" stroke-width="2"/>
                        <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">${helpType.icon}</text>
                    </svg>
                `),
        scaledSize: new google.maps.Size(32, 32),
      },
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `
                <div style="padding: 10px;">
                    <h6 style="margin: 0 0 5px 0; color: ${helpType.color};">
                        ${helpType.icon} ${place.name}
                    </h6>
                    <p style="margin: 0 0 5px 0; font-size: 12px;">
                        ${place.vicinity}
                    </p>
                    <div style="margin-top: 10px;">
                        <button onclick="window.open('https://maps.google.com/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}', '_blank')" 
                                class="btn btn-sm btn-primary">
                            Get Directions
                        </button>
                        ${
                          place.formatted_phone_number
                            ? `
                            <button onclick="window.open('tel:${place.formatted_phone_number}', '_self')" 
                                    class="btn btn-sm btn-success ms-1">
                                Call
                            </button>
                        `
                            : ""
                        }
                    </div>
                </div>
            `,
    })

    marker.addListener("click", () => {
      infoWindow.open(this.map, marker)
    })

    this.helpMarkers.push(marker)
  }
}
