const Event = require("../../models/Event");
const User = require("../../models/User");
const { dateToString } = require("../helpers/date");
const DataLoader = require("dataloader");

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const events = async (eventIds) => {
  const events = await Event.find({ _id: { $in: eventIds } });
  events.sort((a, b) => {
    return (
      eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
    );
  });
  return events.map((event) => {
    return transformEvent(event);
  });
};

const singleEvent = async (eventId) => {
  try {
    // const event = await Event.findById(eventId);
    const event = eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

const user = async (userID) => {
  const user = await userLoader.load(userID.toString());
  return {
    ...user._doc,
    createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
  };
  // return user;
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

// exports.user = user;
// exports.singleEvent = singleEvent;
// exports.events = events;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
