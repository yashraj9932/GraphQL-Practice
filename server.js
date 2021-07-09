const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const Event = require("./models/Event");
//Load environment Variables and also specify that path to the config file
dotenv.config({ path: "./config/config.env" });

connectDB();

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title:String!
        description:String!
        price: Float!
        date:String!
    }

    input EventInput {
        title:String!
        description:String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation{
        createEvent(eventInput:EventInput):Event
    }
    schema {
        query: RootQuery,
        mutation:RootMutation
    }`),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find();
          return events;
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
          });
          const res = await event.save();
          console.log({ ...res._doc });
          return res;
        } catch (err) {
          console.log(err);
        }
      },
    },
    graphiql: true,
  })
);

app.listen(5000, () => {
  console.log("Server Running on port 5000!");
});
