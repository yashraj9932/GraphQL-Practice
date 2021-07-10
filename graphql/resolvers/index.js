const bcrypt = require("bcryptjs");
const Event = require("../../models/Event");
const User = require("../../models/User");

const events = async (eventIds) => {
  const events = await Event.find({ _id: { $in: eventIds } });
  return events.map((event) => {
    return {
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      creator: user.bind(this, event.creator),
    };
  });
};

const user = async (userID) => {
  const user = await User.findById(userID);
  return {
    ...user._doc,
    createdEvents: events.bind(this, user._doc.createdEvents),
  };
  // return user;
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        // console.log(event);
        const a = {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator),
        };
        return a;
      });
    } catch (error) {
      console.log(error);
    }
  },
  createEvent: async (args) => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date,
        creator: "60e9382d5205ff0536ed7089",
      });
      const userr = await User.findById("60e9382d5205ff0536ed7089");
      if (!userr) {
        throw new Error("User doesnt exist");
      }
      userr.createdEvents.push(event);
      await userr.save();
      const res = await event.save();
      const a = {
        ...res._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, res.creator),
      };
      return a;
    } catch (err) {
      console.log(err);
    }
  },
  createUser: async (args) => {
    const user = await User.findOne({ email: args.userInput.email });
    if (user) {
      throw new Error("User already exists");
    }
    try {
      const password = await bcrypt.hash(args.userInput.password, 10);
      const user = new User({
        email: args.userInput.email,
        password: password,
      });
      const res = await user.save();
      // console.log({ ...res._doc, });
      return { ...res._doc, password: null };
    } catch (error) {
      console.error(error);
    }
  },
};
