let express = require("express");
let app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
let PORT = 3000;

const {
  getPackages,
  getPackageByDestination,
  addBooking,
  updateSlots,
  getBookingsByPackage,
} = require("./controllers/index.js");

app.get("/packages", async (req, res) => {
  try {
    let packages = await getPackages();
    if (packages.length === 0) {
      return res.status(404).json({ message: "No packages found." });
    }
    res.status(200).json({ packages: packages });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/packages/:destination", async (req, res) => {
  try {
    let destination = req.params.destination;
    let tempPackage = await getPackageByDestination(destination);
    if (!tempPackage) {
      return res.status(404).json({ message: "No package found" });
    }
    res.status(200).json({ package: tempPackage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

function validateBooking(booking) {
  if (!booking.packageId || typeof booking.packageId !== "number") {
    return "packageId is required and should be a number.";
  }
  if (!booking.customerName || typeof booking.customerName !== "string") {
    return "customerName is required and should be a string.";
  }
  if (!booking.bookingDate || typeof booking.bookingDate !== "string") {
    return "bookingDate is required and should be a string.";
  }
  if (!booking.seats || typeof booking.seats !== "number") {
    return "seats is required and should be a number.";
  }
  return null;
}

app.post("/bookings", async (req, res) => {
  try {
    let newBooking = req.body;
    let error = validateBooking(newBooking);
    if (error) return res.status(400).send(error);
    let booking = await addBooking(newBooking);
    res.status(201).json({ booking: booking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/packages/update-seats", async (req, res) => {
  try {
    let data = req.body;
    let tempPackage = await updateSlots(data);
    res.status(200).json({ package: tempPackage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/bookings/:packageId", async (req, res) => {
  try {
    let packageId = parseInt(req.params.packageId);
    let bookings = await getBookingsByPackage(packageId);
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    res.status(200).json({ bookings: bookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = {
  app,
  validateBooking,
};
