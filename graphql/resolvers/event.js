const Event = require("../../models/Event");
const User = require("../../models/User");

const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (error) {
      console.log(error);
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date,
        creator: req.userId,
      });
      const userr = await User.findById(req.userId);
      if (!userr) {
        throw new Error("User doesnt exist");
      }
      userr.createdEvents.push(event);
      await userr.save();
      const res = await event.save();
      return transformEvent(res);
    } catch (err) {
      console.log(err);
    }
  },
};
