const Booking = require("../../models/Booking");
const Event = require("../../models/Event");

const { transformBooking } = require("./merge");

module.exports = {
  Query: {
    bookings: async (parent, args, req) => {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      try {
        const bookings = await Booking.find({ user: req.userId });
        return bookings.map((booking) => {
          return transformBooking(booking);
        });
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    bookEvent: async (parent, args, req) => {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      const fetchedEvent = await Event.findById(args.eventId);
      // console.log(fetchedEvent);
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent._id,
      });
      const result = await booking.save();
      return transformBooking(result);
    },
    cancelBooking: async (parent, args, req) => {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }

      try {
        const booking = await Booking.findById(args.bookingId).populate(
          "event"
        );
        // const event = transformEvent(booking.event);
        await Booking.deleteOne({ _id: args.bookingId });
        return booking;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
