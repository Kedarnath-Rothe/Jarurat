import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';

function App() {
  const [savedLocation, setSavedLocation] = useState(null);

  const saveLocation = (location) => {
    setSavedLocation(location);
  };

  return (
    <div className="App">
      <h1>Map Location Tracker</h1>
      <MapComponent saveLocation={saveLocation} savedLocation={savedLocation} />
      {savedLocation && (
        <div className="saved-location">
          <h3>Saved Location</h3>
          <p>Latitude: {savedLocation.lat}</p>
          <p>Longitude: {savedLocation.lng}</p>
        </div>
      )}
    </div>
  );
}

export default App;
