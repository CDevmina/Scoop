import React from "react";
import { useFormHandlers } from "../utils/formHandlers";
import { theatersData } from "../config/theaterConfig";
import { genres } from "../config/genres";
import { ageRating } from "../config/ageRating";
import { useMovieForm } from "../hooks/UseMovieForm";
import { initialFormState } from "../constants/formInitialState";
import PersonListInput from "./Admin/PersonListInput";
import BannerUpload from "./Admin/BannerUpload";
import TheaterAuditoriumSelect from "./Admin/TheaterAuditoriumSelect";
import ScreeningDate from "./Admin/ScreeningDate";
import TimeSlotInput from "./Admin/TimeSlotInput";
import TextInput from "./Admin/TextInput";
import TextAreaInput from "./Admin/TextAreaInput";
import PriceInput from "./Admin/PriceInput";
import DurationInput from './Admin/DurationInput';
import Dropdown from "./Admin/Dropdown";
import RatingInput from './Admin/RatingInput';

function AddMovies() {

  const {
    formData,
    setFormData,
    tallBannerPreview,
    setTallBannerPreview,
    wideBannerPreview,
    setWideBannerPreview,
    activeTab,
    setActiveTab,
    resetForm
  } = useMovieForm();

  const formHandlers = useFormHandlers(
    formData,
    setFormData,
    setTallBannerPreview,
    setWideBannerPreview
  );
  
  const {
    handleChange,
    handleFileChange,
    handleTheaterChange,
    handleAuditoriumChange,
    handleAddTimeSlot,
    handleTimeChange,
    handleDeleteTimeSlot,
    handleDateChange,
    handleAddPerson,
    handleRemovePerson,
    handlePersonChange
  } = formHandlers;

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    setFormData(initialFormState);
    setTallBannerPreview(null);
    setWideBannerPreview(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Add Movie</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tab navigation */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`${
              activeTab === 1 ? "bg-red-600 hover:scale-105" : "bg-gray-600 hover:scale-105"
            } py-2 px-4 rounded-md text-white`}
          >
            Movie Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`${
              activeTab === 2 ? "bg-red-600 hover:scale-105" : "bg-gray-600 hover:scale-105"
            } py-2 px-4 rounded-md text-white`}
          >
            Additional Info
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 1 && (
          <div>
            {/* Title */}
            <TextInput
              label="Title"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            {/* Description */}
            <TextAreaInput
              label="Description"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

            {/* Release Date */}
            <ScreeningDate
              label="Release Date"
              selectedDate={formData.releaseDate}
              onDateChange={(date) => handleDateChange(date, "releaseDate")}
            />

            {/* Duration */}
            <DurationInput
              label="Duration"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />

            {/* Adult Price */}
            <PriceInput
              label="Adult Ticket Price"
              id="adultPrice"
              name="adultPrice"
              value={formData.adultPrice}
              onChange={handleChange}
              placeholder="Enter adult ticket price (e.g., 12.50)"
            />

            {/* Kid Price */}
            <PriceInput
              label="Kid Ticket Price"
              id="kidPrice"
              name="kidPrice"
              value={formData.kidPrice}
              onChange={handleChange}
              placeholder="Enter kid ticket price (e.g., 12.50)"
            />

            {/* Tall Banner */}
            <BannerUpload
              label="Upload Tall Banner"
              bannerPreview={tallBannerPreview}
              onUpload={(event) => handleFileChange(event, "tallBanner")}
            />

            {/* Wide Banner */}
            <BannerUpload
              label="Upload Wide Banner"
              bannerPreview={wideBannerPreview}
              onUpload={(event) => handleFileChange(event, "wideBanner")}
            />
            
          </div>

        )}

        {activeTab === 2 && (
          <div>
            {/* Genres */}
            <Dropdown
              data={genres}
              selected={formData.genre}
              onDropdownChange={handleChange}
              id="genre"
              name="genre"
              label="Genre"
            />

            {/* Rating */}
            <RatingInput
              label="Movie Rating"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />

            {/* Age Rating */}
            <Dropdown
              data={ageRating}
              selected={formData.ageRating}
              onDropdownChange={handleChange}
              id="ageRating"
              name="ageRating"
              label="Age Rating"
            />

            {/* Directors */}
            <PersonListInput
              label="Directors"
              persons={formData.directors}
              onAdd={() => handleAddPerson('directors')}
              onRemove={(index) => handleRemovePerson('directors', index)}
              onChange={(index, value) => handlePersonChange('directors', index, value)}
            />

            {/* Actors */}
            <PersonListInput
              label="Actors"
              persons={formData.actors}
              onAdd={() => handleAddPerson('actors')}
              onRemove={(index) => handleRemovePerson('actors', index)}
              onChange={(index, value) => handlePersonChange('actors', index, value)}
            />
            
            {/* Theater & Auditorium */}
            <TheaterAuditoriumSelect
              selectedLocation={formData.locationCinemas[0]?.location}
              locationCinemas={theatersData}
              onLocationChange={(location) => {
                setFormData(prev => ({
                  ...prev,
                  locationCinemas: [{
                    location: location,
                    cinemas: []
                  }]
                }));
              }}
              onFormDataChange={(field, value) => {
                setFormData(prev => ({
                  ...prev,
                  locationCinemas: [{
                    ...prev.locationCinemas[0],
                    [field]: value
                  }]
                }));
              }}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddMovies;
