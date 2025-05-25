export const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const parseSeat = (seat) => {
    const row = seat.charCodeAt(0) - 65;
    const col = parseInt(seat.slice(1), 10) - 1;
    return [row, col];
};

export const getRandomCluster = (availableSeats, clusterSize, currentReserved, cols) => {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
        const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
        const [row, col] = parseSeat(randomSeat);

        const cluster = [];

        for (let offset = 0; offset < clusterSize; offset++) {
            const nextCol = col + offset;
            if (nextCol >= cols) break; // Exceeds row bounds

            // Check for aisle
            if (nextCol === 5 || nextCol === 11 || nextCol === 17) break;

            const seat = `${String.fromCharCode(65 + row)}${nextCol + 1}`;
            if (!availableSeats.includes(seat) || currentReserved.includes(seat)) {
                break; // Seat is unavailable or already reserved
            }
            cluster.push(seat);
        }

        if (cluster.length === clusterSize) {
            return cluster;
        }

        attempts++;
    }

    return []; // Failed to find a suitable cluster
};

export const formatLKR = (number) => {
    return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 2,
    }).format(number);
};