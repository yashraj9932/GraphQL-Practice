const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const dotenv = require("dotenv");

const schema = require("./graphql/schema/index");
const rootValue = require("./graphql/resolvers/index");

const connectDB = require("./config/db");
const auth = require("./middleware/auth");
const cors = require("cors");

//Load environment Variables and also specify that path to the config file
dotenv.config({ path: "./config/config.env" });

connectDB();

app.use(cors());
app.use(auth);

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.listen(5000, () => {
  console.log("Server Running on port 5000!");
});
