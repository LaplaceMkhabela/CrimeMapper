 // Initialize map
        const map = L.map('map').setView([51.505, -0.09], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Array to store crime markers
        const crimeMarkers = [];
        
        // Form elements
        const reportCrimeBtn = document.getElementById('reportCrimeBtn');
        const crimeForm = document.getElementById('crimeForm');
        const submitCrime = document.getElementById('submitCrime');
        const cancelReport = document.getElementById('cancelReport');
        const crimeType = document.getElementById('crimeType');
        const crimeDate = document.getElementById('crimeDate');
        const crimeDescription = document.getElementById('crimeDescription');
        
        // Set today's date as default
        crimeDate.valueAsDate = new Date();
        
        // Click location for new crime report
        let clickLocation = null;
        
        // Handle map click
        map.on('click', function(e) {
            if (crimeForm.style.display === 'block') {
                clickLocation = e.latlng;
                L.marker(e.latlng, {
                    icon: L.divIcon({
                        className: 'crime-marker',
                        iconSize: [24, 24]
                    }),
                    draggable: true
                }).addTo(map).bindPopup("New crime report location").openPopup();
            }
        });
        
        // Report crime button click
        reportCrimeBtn.addEventListener('click', function() {
            crimeForm.style.display = 'block';
        });
        
        // Cancel report
        cancelReport.addEventListener('click', function() {
            crimeForm.style.display = 'none';
            // Remove any temporary markers
            map.eachLayer(layer => {
                if (layer instanceof L.Marker && !crimeMarkers.includes(layer)) {
                    map.removeLayer(layer);
                }
            });
        });
        
        // Submit crime report
        submitCrime.addEventListener('click', function() {
            if (!clickLocation) {
                alert("Please click on the map to select a location");
                return;
            }
            
            const crimeData = {
                type: crimeType.value,
                date: crimeDate.value,
                description: crimeDescription.value,
                location: clickLocation,
                reportedAt: new Date().toISOString()
            };
            
            // Create crime marker
            const crimeIcon = L.divIcon({
                className: 'crime-marker',
                iconSize: [24, 24]
            });
            
            const marker = L.marker(clickLocation, {
                icon: crimeIcon
            }).addTo(map);
            
            // Add popup with crime info
            marker.bindPopup(`
                <strong>${crimeData.type}</strong><br>
                <em>${crimeData.date}</em><br>
                ${crimeData.description}
            `);
            
            // Store marker reference
            crimeMarkers.push(marker);
            
            // Reset form
            crimeForm.style.display = 'none';
            crimeDescription.value = '';
            clickLocation = null;
        });
        
        // Try to get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                map.setView([position.coords.latitude, position.coords.longitude], 15);
            }, function() {
                alert("Could not get your location");
            });
        }
