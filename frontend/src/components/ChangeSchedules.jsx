import React, { useState, useMemo } from "react";
import TableHeader from "./TableHeader";
import TextInput from "./Admin/TextInput";
import TextAreaInput from "./Admin/TextAreaInput";
import PriceInput from "./Admin/PriceInput";
import TheaterAuditoriumSelect from "./Admin/TheaterAuditoriumSelect";
import ScreeningDate from "./Admin/ScreeningDate";
import PersonListInput from "./Admin/PersonListInput";
import DurationInput from "./Admin/DurationInput";
import Dropdown from "./Admin/Dropdown";
import RatingInput from "./Admin/RatingInput";
import { genres } from "../config/genres";
import { ageRating } from "../config/ageRating";
import { sampleSchedules } from "../config/schedules";
import { theatersData } from "../config/theaterConfig";
import { movieScheduleColumns } from "../config/movieSchedule";

function EditSchedule() {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [schedules, setSchedules] = useState(sampleSchedules);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [tallBannerPreview, setTallBannerPreview] = useState(null);
  const [wideBannerPreview, setWideBannerPreview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field) => {
    const order = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const sortedSchedules = useMemo(() => {
    if (!sortField) return schedules;

    return [...schedules].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types
      if (sortField === 'releaseDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'adultPrice') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortField === 'location') {
        aValue = a.locationCinemas[0]?.location || '';
        bValue = b.locationCinemas[0]?.location || '';
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      }
      return 0;
    });
  }, [schedules, sortField, sortOrder]);

  const filteredSchedules = useMemo(() => {
    return sortedSchedules.filter(schedule => {
      const searchString = searchTerm.toLowerCase();
      return (
        schedule.title?.toLowerCase().includes(searchString) ||
        new Date(schedule.releaseDate).toLocaleDateString().toLowerCase().includes(searchString) ||
        schedule.adultPrice?.toString().includes(searchString) ||
        schedule.locationCinemas[0]?.location?.toLowerCase().includes(searchString)
      );
    });
  }, [sortedSchedules, searchTerm]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEdit = (e, schedule) => {
    e.stopPropagation();
    setEditingId(schedule.id);
    setEditFormData(schedule);
    setExpandedId(schedule.id);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    
    // Create a new object without File objects
    const sanitizedFormData = {
      ...editFormData,
      tallBanner: editFormData.tallBanner instanceof File ? 
        URL.createObjectURL(editFormData.tallBanner) : editFormData.tallBanner,
      wideBanner: editFormData.wideBanner instanceof File ? 
        URL.createObjectURL(editFormData.wideBanner) : editFormData.wideBanner
    };

    setSchedules(schedules.map(schedule => 
      schedule.id === editingId ? sanitizedFormData : schedule
    ));
    
    setEditingId(null);
    setEditFormData(null);
    setTallBannerPreview(null);
    setWideBannerPreview(null);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEditFormData(null);
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'tallBanner') {
          setTallBannerPreview(reader.result);
        } else {
          setWideBannerPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      handleInputChange(field, file);
    }
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    setSchedules(schedules.filter(schedule => schedule.id !== deleteId));
    setDeleteId(null);
    setExpandedId(null);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setDeleteId(null);
  };

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-white">Edit Schedule</h1>
      
      {/* Responsive Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search schedules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 text-sm sm:text-base rounded-lg bg-gray-700 text-white"
        />
      </div>

      {/* Scrollable Table Container */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-700">
            <TableHeader
              columns={movieScheduleColumns}
              sortField={sortField}
              sortOrder={sortOrder}
              handleSort={handleSort}
            />
            <tbody className="divide-y divide-gray-700">
              {filteredSchedules.map((schedule) => (
                <React.Fragment key={schedule.id}>
                  <tr 
                    className="bg-gray-800 hover:bg-gray-700 cursor-pointer text-xs sm:text-sm"
                    onClick={() => toggleExpand(schedule.id)}
                  >
                    {/* Table cells with responsive padding */}
                    <td className="px-2 sm:px-4 py-2 sm:py-4 text-white">{schedule.title}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 text-white">
                      {new Date(schedule.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 text-white">
                      {schedule.locationCinemas[0]?.location}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 text-white">${schedule.adultPrice}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2">
                        <button 
                          onClick={(e) => handleEdit(e, schedule)}
                          className="w-full sm:w-auto bg-blue-600 text-white px-3 py-1.5 text-xs sm:text-sm rounded-md hover:bg-blue-700 transition-all"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(e, schedule.id)}
                          className="w-full sm:w-auto bg-red-600 text-white px-3 py-1.5 text-xs sm:text-sm rounded-md hover:bg-red-700 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded View */}
                  {expandedId === schedule.id && (
                    <tr className="bg-gray-900">
                      <td colSpan="5" className="p-2 sm:p-4">
                        {editingId === schedule.id ? (
                          <div className="space-y-4">
                            <TextInput
                              label="Title"
                              id="title"
                              name="title"
                              value={editFormData.title}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                            />
                            <TextAreaInput
                              label="Description"
                              id="description"
                              name="description"
                              value={editFormData.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                            {/* <TheaterAuditoriumSelect
                              theatersData={theatersData}
                              selectedTheater={editFormData.theaters}
                              selectedAuditorium={editFormData.auditorium}
                              onTheaterChange={(value) => handleInputChange('theaters', value)}
                              onAuditoriumChange={(value) => handleInputChange('auditorium', value)}
                            /> */}
                            <ScreeningDate
                              label="Release Date"
                              selectedDate={editFormData.releaseDate}
                              onDateChange={(date) => handleInputChange('releaseDate', date)}
                            />

                            {/* Duration */}
                            <DurationInput
                              label="Duration"
                              id="duration"
                              name="duration"
                              value={editFormData.duration}
                              onChange={(e) => handleInputChange('duration', e.target.value)}
                            />

                            {/* Genres */}
                            <Dropdown
                              data={genres}
                              selected={editFormData.genre}
                              onDropdownChange={(e) => handleInputChange('genre', e.target.value)}
                              id="genre"
                              name="genre"
                              label="Genre"
                            />

                            <RatingInput
                              label="Movie Rating"
                              id="rating"
                              name="rating"
                              value={editFormData.rating}
                              onChange={(e) => handleInputChange('rating', e.target.value)}
                            />

                            {/* Age Rating */}
                            <Dropdown
                              data={ageRating}
                              selected={editFormData.ageRating}
                              onDropdownChange={(e) => handleInputChange('ageRating', e.target.value)}
                              id="ageRating"
                              name="ageRating"
                              label="Age Rating"
                            />

                            <PriceInput
                              label="Adult Price"
                              id="adultPrice"
                              name="adultPrice"
                              value={editFormData.adultPrice}
                              onChange={(e) => handleInputChange('adultPrice', e.target.value)}
                            />
                            <PriceInput
                              label="Child Price"
                              id="kidPrice"
                              name="kidPrice"
                              value={editFormData.kidPrice}
                              onChange={(e) => handleInputChange('kidPrice', e.target.value)}
                            />
                            <PersonListInput
                              label="Actors"
                              persons={editFormData.actors || []}
                              onAdd={() => handleInputChange('actors', [...(editFormData.actors || []), ''])}
                              onRemove={(index) => {
                                const updatedActors = [...editFormData.actors];
                                updatedActors.splice(index, 1);
                                handleInputChange('actors', updatedActors);
                              }}
                              onChange={(index, value) => {
                                const updatedActors = [...editFormData.actors];
                                updatedActors[index] = value;
                                handleInputChange('actors', updatedActors);
                              }}
                            />
                            <PersonListInput
                              label="Directors"
                              persons={editFormData.directors || []}
                              onAdd={() => handleInputChange('directors', [...(editFormData.directors || []), ''])}
                              onRemove={(index) => {
                                const updatedDirectors = [...editFormData.directors];
                                updatedDirectors.splice(index, 1);
                                handleInputChange('directors', updatedDirectors);
                              }}
                              onChange={(index, value) => {
                                const updatedDirectors = [...editFormData.directors];
                                updatedDirectors[index] = value;
                                handleInputChange('directors', updatedDirectors);
                              }}
                            />

                            <TheaterAuditoriumSelect
                              selectedLocation={editFormData.locationCinemas[0]?.location}
                              locationCinemas={theatersData}
                              editFormData={editFormData} // Pass editFormData
                              onLocationChange={(location) => {
                                handleInputChange('locationCinemas', [{
                                  location: location,
                                  cinemas: []
                                }]);
                              }}
                              onFormDataChange={(field, value) => {
                                if (field === 'cinemas') {
                                  handleInputChange('locationCinemas', [{
                                    ...editFormData.locationCinemas[0],
                                    cinemas: value.map(cinemaName => ({
                                      name: cinemaName,
                                      formats: []
                                    }))
                                  }]);
                                } else if (field === 'formats') {
                                  const { cinema, format, enabled } = value;
                                  const updatedCinemas = editFormData.locationCinemas[0].cinemas.map(c => {
                                    if (c.name === cinema) {
                                      const existingFormats = c.formats || [];
                                      if (enabled) {
                                        return {
                                          ...c,
                                          formats: [...existingFormats, { type: format, showtimes: [] }]
                                        };
                                      } else {
                                        return {
                                          ...c,
                                          formats: existingFormats.filter(f => f.type !== format)
                                        };
                                      }
                                    }
                                    return c;
                                  });

                                  handleInputChange('locationCinemas', [{
                                    ...editFormData.locationCinemas[0],
                                    cinemas: updatedCinemas
                                  }]);
                                } else if (field === 'locationCinemas') {
                                  handleInputChange('locationCinemas', [value]);
                                }
                              }}
                            />

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-white">Tall Banner</label>
                              <input
                                type="file"
                                onChange={(e) => handleFileChange('tallBanner', e.target.files[0])}
                                className="hidden"
                                id={`tall-banner-${schedule.id}`}
                                accept="image/*"
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById(`tall-banner-${schedule.id}`).click()}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 hover:scale-105 focus:outline-none transition-transform duration-200"
                              >
                                Browse Tall Banner
                              </button>
                              {tallBannerPreview && (
                                <img src={tallBannerPreview} alt="Tall Banner Preview" className="h-40 object-contain mt-2" />
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-white mt-4">Wide Banner</label>
                              <input
                                type="file"
                                onChange={(e) => handleFileChange('wideBanner', e.target.files[0])}
                                className="hidden"
                                id={`wide-banner-${schedule.id}`}
                                accept="image/*"
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById(`wide-banner-${schedule.id}`).click()}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 hover:scale-105 focus:outline-none transition-transform duration-200"
                              >
                                Browse Wide Banner
                              </button>
                              {wideBannerPreview && (
                                <img src={wideBannerPreview} alt="Wide Banner Preview" className="h-40 object-contain mt-2" />
                              )}
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-105 hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:scale-105 hover:bg-red-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-white space-y-4 text-xs sm:text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <p><span className="font-bold">Description:</span> {schedule.description}</p>
                                <p><span className="font-bold">Duration:</span> {schedule.duration} minutes</p>
                                <p><span className="font-bold">Genre:</span> {schedule.genre}</p>
                                <p><span className="font-bold">Rating:</span> {schedule.rating}</p>
                                <p><span className="font-bold">Age Rating:</span> {schedule.ageRating}</p>
                                <p><span className="font-bold">Directors:</span> {schedule.directors?.join(', ')}</p>
                                <p><span className="font-bold">Actors:</span> {schedule.actors?.join(', ')}</p>
                                <p><span className="font-bold">Adult Price:</span> ${schedule.adultPrice}</p>
                                <p><span className="font-bold">Child Price:</span> ${schedule.kidPrice}</p>
                              </div>
                              <div className="space-y-4">
                                <span className="font-bold block mb-4">Locations and Showtimes:</span>
                                {schedule.locationCinemas?.map((location, locIndex) => (
                                  <div key={locIndex} className="mb-6">
                                    <p className="font-semibold text-red-500 mb-3">{location.location}</p>
                                    {location.cinemas?.map((cinema, cinIndex) => (
                                      <div key={cinIndex} className="ml-4 mb-4">
                                        <p className="font-medium text-yellow-500 mb-2">{cinema.name}</p>
                                        {cinema.formats?.map((format, formatIndex) => (
                                          <div key={formatIndex} className="ml-4 mb-3">
                                            <p className="text-blue-400 mb-2">{format.type}</p>
                                            <div className="ml-4 space-y-2">
                                              {format.showtimes?.map((showtime, index) => (
                                                <div key={index} className="text-sm">
                                                  {new Date(showtime.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                  })}
                                                  {' '}-{' '}
                                                  {showtime.startTime}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-6 mb-4">
                              <p><span className="font-bold">Tall Banner:</span></p>
                              {schedule.tallBanner && (
                                <img 
                                  src={schedule.tallBanner} 
                                  alt="Tall Banner Preview" 
                                  className="h-20 w-auto object-contain"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-6">
                              <p><span className="font-bold">Wide Banner:</span></p>
                              {schedule.wideBanner && (
                                <img 
                                  src={schedule.wideBanner} 
                                  alt="Wide Banner Preview" 
                                  className="h-20 w-auto object-contain"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-white mb-4">Are you sure you want to delete this schedule?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover:scale-105"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditSchedule;