const request = require("supertest");
let { app, validateBooking } = require("../index.js");
let {
  getPackages,
  getPackageByDestination,
  addBooking,
  updateSlots,
  getBookingsByPackage,
} = require("../controllers/index.js");
const http = require("http");

jest.mock("../controllers/index.js", () => ({
  ...jest.requireActual("../controllers/index.js"),
  getPackages: jest.fn(),
  getPackageByDestination: jest.fn(),
  addBooking: jest.fn(),
  updateSlots: jest.fn(),
  getBookingsByPackage: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all packages", async () => {
    const mockPackages = [
      {
        packageId: 1,
        destination: "Paris",
        price: 1500,
        duration: 7,
        availableSlots: 10,
      },
      {
        packageId: 2,
        destination: "Rome",
        price: 1200,
        duration: 5,
        availableSlots: 15,
      },
      {
        packageId: 3,
        destination: "Tokyo",
        price: 2000,
        duration: 10,
        availableSlots: 8,
      },
      {
        packageId: 4,
        destination: "New York",
        price: 1700,
        duration: 7,
        availableSlots: 12,
      },
      {
        packageId: 5,
        destination: "Dubai",
        price: 1100,
        duration: 4,
        availableSlots: 20,
      },
      {
        packageId: 6,
        destination: "Sydney",
        price: 2500,
        duration: 12,
        availableSlots: 5,
      },
      {
        packageId: 7,
        destination: "Cape Town",
        price: 1800,
        duration: 8,
        availableSlots: 6,
      },
      {
        packageId: 8,
        destination: "Bangkok",
        price: 800,
        duration: 3,
        availableSlots: 25,
      },
      {
        packageId: 9,
        destination: "Barcelona",
        price: 1400,
        duration: 6,
        availableSlots: 10,
      },
      {
        packageId: 10,
        destination: "Bali",
        price: 1300,
        duration: 5,
        availableSlots: 15,
      },
      {
        packageId: 11,
        destination: "Istanbul",
        price: 1000,
        duration: 4,
        availableSlots: 18,
      },
      {
        packageId: 12,
        destination: "London",
        price: 1900,
        duration: 9,
        availableSlots: 7,
      },
      {
        packageId: 13,
        destination: "Hawaii",
        price: 2200,
        duration: 10,
        availableSlots: 8,
      },
      {
        packageId: 14,
        destination: "Moscow",
        price: 1600,
        duration: 8,
        availableSlots: 10,
      },
      {
        packageId: 15,
        destination: "Athens",
        price: 1200,
        duration: 6,
        availableSlots: 12,
      },
    ];

    getPackages.mockResolvedValue(mockPackages);

    const result = await request(server).get("/packages");

    expect(result.statusCode).toEqual(200);
    expect(result.body.packages).toEqual(mockPackages);
  });

  it("should retrieve a specific package by destination", async () => {
    const mockPackage = {
      packageId: 1,
      destination: "Paris",
      price: 1500,
      duration: 7,
      availableSlots: 10,
    };

    getPackageByDestination.mockResolvedValue(mockPackage);

    const result = await request(server).get("/packages/Paris");

    expect(result.statusCode).toEqual(200);
    expect(result.body.package).toEqual(mockPackage);
  });

  it("should add a new booking", async () => {
    const mockBooking = {
      bookingId: 6,
      packageId: 4,
      customerName: "Raj Kulkarni",
      bookingDate: "2024-12-20",
      seats: 2,
    };

    addBooking.mockResolvedValue(mockBooking);

    const result = await request(server).post("/bookings").send({
      packageId: 4,
      customerName: "Raj Kulkarni",
      bookingDate: "2024-12-20",
      seats: 2,
    });
    expect(result.statusCode).toEqual(201);
    expect(result.body.booking).toEqual(mockBooking);
  });

  it("should update available slots", async () => {
    const mockPackage = {
      packageId: 1,
      destination: "Paris",
      price: 1500,
      duration: 7,
      availableSlots: 8,
    };

    updateSlots.mockResolvedValue(mockPackage);

    const result = await request(server).post("/packages/update-seats").send({
      packageId: 1,
      seatsBooked: 2,
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.package).toEqual(mockPackage);
  });

  it("should retrieve bookings for a package", async () => {
    const mockBookings = [
      {
        bookingId: 1,
        packageId: 1,
        customerName: "Anjali Seth",
        bookingDate: "2024-12-01",
        seats: 2,
      },
    ];

    getBookingsByPackage.mockResolvedValue(mockBookings);

    const result = await request(server).get("/bookings/1");

    expect(result.statusCode).toEqual(200);
    expect(result.body.bookings).toEqual(mockBookings);
  });
});
