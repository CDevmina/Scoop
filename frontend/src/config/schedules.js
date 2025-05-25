export const sampleSchedules = [
  {
    id: 1,
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseDate: new Date('2025-01-15T00:00:00+0530'),
    duration: "152",
    genre: "Action",
    rating: "9.0",
    ageRating: "PG-13",
    tallBanner: "path/to/banner1.jpg",
    wideBanner: "path/to/wide1.jpg",
    actors: ["Christian Bale", "Heath Ledger"],
    directors: ["Christopher Nolan"],
    locationCinemas: [
      {
        location: "Colombo",
        cinemas: [{
          name: "Liberty Cinema",
          formats: [
            {
              type: "Digital 2D",
              showtimes: [
                { startTime: '10:00', date: new Date('2025-01-15T00:00:00+0530') },
                { startTime: '14:30', date: new Date('2025-01-15T00:00:00+0530') }
              ]
            },
            {
              type: "IMAX 3D",
              showtimes: [
                { startTime: '13:00', date: new Date('2025-01-15T00:00:00+0530') }
              ]
            }
          ]
        }]
      }
    ],
    adultPrice: "1500",
    kidPrice: "1000"
  },
  {
    id: 2,
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseDate: new Date('2025-01-20T00:00:00+0530'),
    duration: "148",
    genre: "Sci-Fi",
    rating: "8.8",
    ageRating: "PG-13",
    tallBanner: "path/to/banner2.jpg",
    wideBanner: "path/to/wide2.jpg",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    directors: ["Christopher Nolan"],
    locationCinemas: [
      {
        location: "Kandy",
        cinemas: [{
          name: "Kandy City Cinema",
          formats: [
            {
              type: "Digital 2D",
              showtimes: [
                { startTime: '11:00', date: new Date('2025-01-20T00:00:00+0530') },
                { startTime: '15:30', date: new Date('2025-01-20T00:00:00+0530') }
              ]
            }
          ]
        }]
      }
    ],
    adultPrice: "1200",
    kidPrice: "800"
  },
  {
    id: 3,
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseDate: new Date('2025-02-01T00:00:00+0530'),
    duration: "169",
    genre: "Sci-Fi",
    rating: "8.7",
    ageRating: "PG-13",
    tallBanner: "path/to/banner3.jpg",
    wideBanner: "path/to/wide3.jpg",
    actors: ["Matthew McConaughey", "Anne Hathaway"],
    directors: ["Christopher Nolan"],
    locationCinemas: [
      {
        location: "Galle",
        cinemas: [{
          name: "Ritz Cinema",
          formats: [
            {
              type: "Digital 2D",
              showtimes: [
                { startTime: '09:30', date: new Date('2025-02-01T00:00:00+0530') },
                { startTime: '13:30', date: new Date('2025-02-01T00:00:00+0530') }
              ]
            },
            {
              type: "Digital 3D",
              showtimes: [
                { startTime: '16:00', date: new Date('2025-02-01T00:00:00+0530') }
              ]
            }
          ]
        }]
      }
    ],
    adultPrice: "1300",
    kidPrice: "900"
  }
];