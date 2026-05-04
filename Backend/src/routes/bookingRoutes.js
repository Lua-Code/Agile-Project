import express from "express";
const router = express.Router();
import {
  createBooking,
  getBookings,
  cancelBooking,
} from "../controllers/bookingController.js";



router.get("/", getBookings);
router.post("/", createBooking);
router.patch("/:id/cancel", cancelBooking);

export default router;