export const initialFormState = {
  title: "",
  description: "",
  releaseDate: null,
  duration: "",
  genre: "",
  rating: "",
  ageRating: "",
  tallBanner: "",
  wideBanner: "",
  actors: [],
  directors: [],
  locationCinemas: [
    {
      location: '',
      cinemas: [{
        name: '',
        formats: [
          {
            type: '',
            showtimes: [
              { timeSlots: null},
            ]
          },
        ]
      }]
    }
  ],
  adultPrice: "",
  kidPrice: "",
};