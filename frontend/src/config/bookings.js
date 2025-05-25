export const sampleBookings = [
    {
      id: 1,
      bookingNumber: "BK001",
      userEmail: "john@example.com",
      amountPaid: "1500.00",
      seatsBooked: ["A1", "A2", "A3"],
      movieName: "The Dark Knight",
      movieDate: "2024-03-20",
      timeSlot: [
        {
          startTime: new Date('2025-01-15T00:00:00+0530'),
          endTime: new Date('2025-01-15T02:00:00+0530')
        },
        {
          startTime: new Date('2025-01-15T15:00:00+0530'),
          endTime: new Date('2025-01-15T17:00:00+0530')
        }
      ],
      datePaid: "2024-03-15",
      orderId: "ORD001",
      paymentMethod: "Credit Card"
    },
    {
      id: 2,
      bookingNumber: "BK002",
      userEmail: "jane@example.com",
      amountPaid: "1000.00",
      seatsBooked: ["B4", "B5"],
      movieName: "Inception",
      movieDate: "2024-03-25",
      timeSlot: [
        {
          startTime: new Date('2025-01-15T14:00:00+0530'),
          endTime: new Date('2025-01-15T17:00:00+0530')
        }
      ],
      datePaid: "2024-03-20",
      orderId: "ORD002",
      paymentMethod: "PayPal"
    }
  ];