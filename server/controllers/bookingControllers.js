import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// Get logged in user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('tour');
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { tour, date, guests = 1 } = req.body;

    // Verify the tour exists
    const tourExists = await Tour.findById(tour);
    if (!tourExists) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    // Automatically calculate total price
    const totalPrice = tourExists.price * Number(guests);

    const newBooking = await Booking.create({
      user: req.user._id,
      tour,
      bookingDate: date || Date.now(),
      guests: Number(guests),
      totalPrice,
    });

    // Fetch user details to get their email address
    const user = await User.findById(req.user._id);

    if (user && user.email) {
      try {
        const message = `Hello ${user.name || 'Traveler'},\n\nYour booking for "${tourExists.title}" has been successfully confirmed!\n\nDetails:\n- Location: ${tourExists.location}\n- Guests: ${guests}\n- Total Price: $${totalPrice}\n\nThank you for booking with us!`;
        
        const html = `
          <h2>Booking Confirmation</h2>
          <p>Hello <strong>${user.name || 'Traveler'}</strong>,</p>
          <p>Your booking for <strong>${tourExists.title}</strong> has been successfully confirmed!</p>
          <ul>
            <li><strong>Location:</strong> ${tourExists.location}</li>
            <li><strong>Guests:</strong> ${guests}</li>
            <li><strong>Total Price:</strong> $${totalPrice}</li>
          </ul>
          <p>Thank you for booking with us!</p>
        `;

        await sendEmail({
          email: user.email,
          subject: `Booking Confirmed: ${tourExists.title}`,
          message,
          html,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // We don't want the booking to fail if the email fails, so we just log it
      }
    }

    res.status(201).json({
      success: true,
      data: newBooking,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
             return res.status(401).json({ success: false, message: 'Not authorized to delete this booking' });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Booking removed'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};