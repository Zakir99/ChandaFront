import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom location search component
function LocationSearch({ onLocationSelect, map }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&limit=5&addressdetails=1`,
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError("Failed to search location");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location) => {
    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lon);
    const displayName = location.display_name;
    const value = `${lat}, ${lng}`;

    onLocationSelect(value, displayName);
    setSearchQuery(displayName);
    setSuggestions([]);

    if (map) {
      map.flyTo([lat, lng], 13);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchLocation(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="relative mb-4">
      <div className="relative">
        {/* <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white"
        /> */}
        {isSearching && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium">
                {suggestion.display_name.split(",")[0]}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {suggestion.display_name}
              </div>
            </button>
          ))}
        </div>
      )}

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}

// Map click handler component
function MapClickHandler({ onLocationSelect, currentLocation, onLocationSelectAndHide }) {
  const [position, setPosition] = useState(
    currentLocation ? [currentLocation.lat, currentLocation.lng] : null,
  );

  useEffect(() => {
    if (currentLocation) {
      setPosition([currentLocation.lat, currentLocation.lng]);
    }
  }, [currentLocation]);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const value = `${lat}, ${lng}`;

      setPosition([lat, lng]);
      // Call the callback with the location
      onLocationSelect(value, `${lat}, ${lng}`);
      
      // Call the hide function if provided
      if (onLocationSelectAndHide) {
        onLocationSelectAndHide();
      }
    },
  });

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();
      if (data.display_name) {
        onLocationSelect(`${lat}, ${lng}`, data.display_name);
      }
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
  };

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    const value = `${lat}, ${lng}`;
    setPosition([lat, lng]);
    onLocationSelect(value, `${lat}, ${lng}`);
    reverseGeocode(lat, lng);
  };

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    />
  ) : null;
}

// Location Display Component
function LocationDisplay({ location, onRemove }) {
  if (!location) return null;

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-blue-900">
              Selected Location
            </span>
          </div>
          <p className="text-sm text-blue-700 break-all">
            {location.address || location.value}
          </p>
          {location.value && location.address !== location.value && (
            <p className="text-xs text-blue-500 mt-1">
              Coordinates: {location.value}
            </p>
          )}
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
            title="Remove location"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Main MapPicker Component
export default function MapPicker({
  value,
  onChange,
  name,
  placeholder = "Search for a location...",
  height = "250px",
  zoom = 10,
  disabled = false,
  required = false,
  className = "",
}) {
  const [location, setLocation] = useState(() => {
    if (value && typeof value === "string" && value.trim() !== "") {
      const coords = value.split(",").map((coord) => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return {
          value: value,
          lat: coords[0],
          lng: coords[1],
          address: null,
        };
      }
    }
    return null;
  });

  const [mapInstance, setMapInstance] = useState(null);
  const [center, setCenter] = useState(
    location ? [location.lat, location.lng] : [30.1825, 66.9591],
  );
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!value) {
      setLocation(null);
      return;
    }

    const coords = value.split(",").map((c) => parseFloat(c.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      setLocation({
        value,
        lat: coords[0],
        lng: coords[1],
        address: null,
      });
      setCenter([coords[0], coords[1]]);
    }
  }, [value]);

  // Handle location selection
  const handleLocationSelect = (value, address = null) => {
    const coords = value.split(",").map((coord) => parseFloat(coord.trim()));
    const newLocation = {
      value: value,
      lat: coords[0],
      lng: coords[1],
      address: address,
    };

    setLocation(newLocation);
    setCenter([coords[0], coords[1]]);

    // Notify parent component
    if (onChange) {
      onChange(value);
    }
  };

  const handleRemoveLocation = () => {
    setLocation(null);
    setCenter([30.1825, 66.9591]);
    if (onChange) {
      onChange("");
    }
  };

  const handleHideMap = () => {
    setShowMap(false);
  };

  const handleShowMap = () => {
    setShowMap(true);
  };

  return (
    <div className={`location-picker ${className}`}>
      {/* Search Input */}
      {!disabled && (
        <LocationSearch
          onLocationSelect={handleLocationSelect}
          map={mapInstance}
        />
      )}

      {/* Show Map Button */}
      {!disabled && !showMap && (
        <button
          type="button"
          onClick={handleShowMap}
          className="mb-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span>Open Map to Select Location</span>
        </button>
      )}

      {/* Map Container with Hide Button */}
      {showMap && (
        <div className="mb-4">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={handleHideMap}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center space-x-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span>Hide Map</span>
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <MapContainer
              zoomControl={!disabled}
              scrollWheelZoom={!disabled}
              zoomAnimation={true}
              fadeAnimation={true}
              center={center}
              zoom={zoom}
              style={{ height, width: "100%", borderRadius: "12px" }}
              whenCreated={setMapInstance}
            >
              <TileLayer
                url={`https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=qt207mGAL0qwNRUHna9x`}
                attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {!disabled && (
                <MapClickHandler
                  onLocationSelect={handleLocationSelect}
                  currentLocation={location}
                  onLocationSelectAndHide={handleHideMap}
                />
              )}

              {disabled && location && (
                <Marker position={[location.lat, location.lng]} />
              )}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Location Display */}
      <LocationDisplay
        location={location}
        onRemove={!disabled ? handleRemoveLocation : undefined}
      />

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={location?.value || ""}
        required={required}
      />
    </div>
  );
}