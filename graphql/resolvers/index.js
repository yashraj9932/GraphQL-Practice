const authResolver = require("./auth");
const eventsResolver = require("./event");
const bookingResolver = require("./booking");

const resolvers = [authResolver, eventsResolver, bookingResolver];

module.exports = resolvers;
