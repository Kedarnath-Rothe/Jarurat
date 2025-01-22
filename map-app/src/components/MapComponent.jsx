import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
 
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', 
  iconSize: [40, 40], 
  iconAnchor: [20, 40],  
});

const highlightedIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',  
  iconSize: [70, 70],  
  iconAnchor: [35, 60], 
  className: 'highlighted-marker', 
});

const MapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);  
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);  
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(null);  

  useEffect(() => { 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      });
    }
 
    fetchSavedLocations();
  }, []);
 
  const fetchSavedLocations = async () => {
    try {
      const response = await fetch('https://jarurat.vercel.app/api/locations');
      const data = await response.json();
      setSavedLocations(data.locations);
    } catch (error) {
      console.error('Error fetching saved locations:', error);
    }
  };
 
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setClickedLocation({ lat, lng });
      },
    });
    return null;
  };
 
  const handleSaveLocation = async () => {
    if (clickedLocation) {
      try {
        const response = await fetch('https://jarurat.vercel.app/api/locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: clickedLocation.lat,
            longitude: clickedLocation.lng,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          alert('Location saved successfully!');
          console.log('Saved location:', data);
          fetchSavedLocations();  
        } else {
          alert('Failed to save location.');
        }
      } catch (error) {
        console.error('Error saving location:', error);
        alert('An error occurred while saving the location.');
      }
    }
  };
 
  const handleSeeLocation = (lat, lng, index) => {
    setMapCenter([lat, lng]);  
    setSelectedLocationIndex(index);  
  };

  return (
    <div className="map-container grid">
      <div>
      <br/>
      <br/>
      <MapContainer center={mapCenter} zoom={13} style={{ height: '70vh', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentLocation && (
          <Marker position={currentLocation} icon={defaultIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
        {clickedLocation && (
          <Marker position={clickedLocation} icon={defaultIcon}>
            <Popup>Clicked Location: {`Lat: ${clickedLocation.lat}, Lng: ${clickedLocation.lng}`}</Popup>
          </Marker>
        )}
        {savedLocations.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
            icon={selectedLocationIndex === index ? highlightedIcon : defaultIcon} // Highlight the selected location
          >
            <Popup>
              Saved Location: {`Lat: ${location.latitude}, Lng: ${location.longitude}`}
            </Popup>
          </Marker>
        ))}
        <MapClickHandler />
      </MapContainer>

      <div className="button-container" style={{ textAlign: 'center', marginTop: '10px' }}>
        {clickedLocation && (
          <>
            <p>
              <strong>Clicked Coordinates:</strong> Lat: {clickedLocation.lat}, Lng: {clickedLocation.lng}
            </p>
            <button className="save-btn" onClick={handleSaveLocation}>
              Save Location
            </button>
          </>
        )}
      </div>
      </div>
 
      <div className="saved-locations-table" style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3>Saved Locations</h3>
        <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {savedLocations.map((location, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{location.latitude}</td>
                <td>{location.longitude}</td>
                <td>
                  <button className='btn' onClick={() => handleSeeLocation(location.latitude, location.longitude, index)}>
                    See Location
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MapComponent;
