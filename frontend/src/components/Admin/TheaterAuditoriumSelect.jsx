import React, { useState, useEffect } from "react";
import TimeSlotInput from "./TimeSlotInput";
import { theatersData } from "../../config/theaterConfig";

function TheaterAuditoriumSelect({ 
  selectedLocation,
  locationCinemas,
  onLocationChange,
  onFormDataChange,
  editFormData
}) {
  const formatTypes = ["Digital 2D", "Digital 3D", "IMAX 3D"];
  const [availableCinemas, setAvailableCinemas] = useState([]);
  const [selectedCinemasList, setSelectedCinemasList] = useState([]);
  const [cinemaFormats, setCinemaFormats] = useState({});

  // Initialize with existing data
  useEffect(() => {
    if (selectedLocation) {
      // Set available cinemas based on location
      const cinemas = theatersData.find(t => t.location === selectedLocation)?.cinemas || [];
      setAvailableCinemas(cinemas);

      if (editFormData?.locationCinemas?.[0]) {
        // Set selected cinemas from edit data
        const selectedCinemas = editFormData.locationCinemas[0].cinemas.map(c => c.name);
        setSelectedCinemasList(selectedCinemas);

        // Initialize format data from edit data
        const formatData = {};
        editFormData.locationCinemas[0].cinemas.forEach(cinema => {
          formatData[cinema.name] = {
            formats: {}
          };
          cinema.formats.forEach(format => {
            formatData[cinema.name].formats[format.type] = {
              timeSlots: format.showtimes || []
            };
          });
        });
        setCinemaFormats(formatData);
      }
    }
  }, [selectedLocation, editFormData]);

  const handleLocationChange = (e) => {
    const location = e.target.value;
    const cinemas = theatersData.find(t => t.location === location)?.cinemas || [];
    setAvailableCinemas(cinemas);
    setSelectedCinemasList([]);
    setCinemaFormats({});
    onLocationChange(location);
  };

  const handleCinemaToggle = (cinema) => {
    const updatedList = selectedCinemasList.includes(cinema)
      ? selectedCinemasList.filter(c => c !== cinema)
      : [...selectedCinemasList, cinema];
    setSelectedCinemasList(updatedList);
    
    if (!updatedList.includes(cinema)) {
      const { [cinema]: _, ...rest } = cinemaFormats;
      setCinemaFormats(rest);
    } else {
      setCinemaFormats(prev => ({
        ...prev,
        [cinema]: { formats: {} }
      }));
    }
    // Update parent form data
    onFormDataChange('cinemas', updatedList);
  };

  const handleFormatToggle = (cinema, format) => {
    setCinemaFormats(prev => ({
      ...prev,
      [cinema]: {
        ...prev[cinema],
        formats: {
          ...prev[cinema].formats,
          [format]: prev[cinema].formats[format] 
            ? undefined 
            : { timeSlots: [] }
        }
      }
    }));
    // Update parent form data with new format selections
    onFormDataChange('formats', {
      cinema,
      format,
      enabled: !cinemaFormats[cinema]?.formats[format]
    });
  };

  // Update handleTimeChange to notify parent
  const handleTimeChange = (cinema, format, index, field, time) => {
    setCinemaFormats(prev => ({
      ...prev,
      [cinema]: {
        ...prev[cinema],
        formats: {
          ...prev[cinema].formats,
          [format]: {
            ...prev[cinema].formats[format],
            timeSlots: prev[cinema].formats[format].timeSlots.map((slot, i) => 
              i === index ? { ...slot, [field]: time } : slot
            )
          }
        }
      }
    }));
    
    // Notify parent of time slot changes
    onFormDataChange('locationCinemas', {
      location: selectedLocation,
      cinemas: selectedCinemasList.map(cinemaName => ({
        name: cinemaName,
        formats: Object.entries(cinemaFormats[cinemaName]?.formats || {})
          .filter(([_, formatData]) => formatData !== undefined)
          .map(([formatType, formatData]) => ({
            type: formatType,
            showtimes: formatData.timeSlots || []
          }))
      }))
    });
  };

  // Apply same pattern to handleAddTimeSlot and handleDeleteTimeSlot
  const handleAddTimeSlot = (cinema, format) => {
    setCinemaFormats(prev => ({
      ...prev,
      [cinema]: {
        ...prev[cinema],
        formats: {
          ...prev[cinema].formats,
          [format]: {
            ...prev[cinema].formats[format],
            timeSlots: [
              ...(prev[cinema].formats[format].timeSlots || []),
              { startTime: ''}
            ]
          }
        }
      }
    }));
    
    // Notify parent after adding time slot
    onFormDataChange('locationCinemas', {
      location: selectedLocation,
      cinemas: selectedCinemasList.map(cinemaName => ({
        name: cinemaName,
        formats: Object.entries(cinemaFormats[cinemaName]?.formats || {})
          .filter(([_, formatData]) => formatData !== undefined)
          .map(([formatType, formatData]) => ({
            type: formatType,
            showtimes: formatData.timeSlots || []
          }))
      }))
    });
  };

  const handleDeleteTimeSlot = (cinema, format, index) => {
    setCinemaFormats(prev => ({
      ...prev,
      [cinema]: {
        ...prev[cinema],
        formats: {
          ...prev[cinema].formats,
          [format]: {
            ...prev[cinema].formats[format],
            timeSlots: prev[cinema].formats[format].timeSlots.filter((_, i) => i !== index)
          }
        }
      }
    }));
  };

  return (
    <div className="space-y-4">
      {/* Location Selection */}
      <div className="pb-4">
        <label className="block text-sm font-medium text-white">Location</label>
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:outline-none text-black"
        >
          <option value="">Select Location</option>
          {theatersData.map((theater) => (
            <option key={theater.location} value={theater.location}>
              {theater.location}
            </option>
          ))}
        </select>
      </div>

      {/* Cinema Selection with Formats */}
      {selectedLocation && (
        <div className="space-y-4">
          {availableCinemas.map((cinema) => (
            <div key={cinema} className="p-4 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCinemasList.includes(cinema)}
                    onChange={() => handleCinemaToggle(cinema)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-white font-medium">{cinema}</span>
                </label>
              </div>

              {selectedCinemasList.includes(cinema) && (
                <div className="mt-4 ml-6 space-y-4">
                  {/* Format Selection */}
                  <div className="space-y-2">
                    {formatTypes.map((format) => (
                      <div key={format} className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={!!cinemaFormats[cinema]?.formats[format]}
                            onChange={() => handleFormatToggle(cinema, format)}
                            className="rounded text-red-600 focus:ring-red-500"
                          />
                          <span className="text-white">{format}</span>
                        </label>

                        {cinemaFormats[cinema]?.formats[format] && (
                          <div className="ml-6">
                            <TimeSlotInput
                              timeSlots={cinemaFormats[cinema].formats[format].timeSlots || []}
                              handleTimeChange={(index, field, time) => handleTimeChange(cinema, format, index, field, time)}
                              handleDeleteTimeSlot={(index) => handleDeleteTimeSlot(cinema, format, index)}
                              handleAddTimeSlot={() => handleAddTimeSlot(cinema, format)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TheaterAuditoriumSelect;
