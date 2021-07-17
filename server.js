const express = require("express");
const app = express();
const dotenv = require("dotenv");

const schema = require("./graphql/schema/index");

const connectDB = require("./config/db");
const auth = require("./middleware/auth");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");

//Load environment Variables and also specify that path to the config file
dotenv.config({ path: "./config/config.env" });

connectDB();

app.use(auth);

app.use(express.json());

// async function startApolloServer(schema) {
const server = new ApolloServer({
  schema,
  playground: true,
  context: ({ req }) => {
    let { userId, isAuth } = req;

    return {
      req,
      userId,
      isAuth,
    };
  },
});

// await server.start();

//Applying middlewares like body parser and cors
server.applyMiddleware({
  app,
  path: "/graphql",
});

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
// server.installSubscriptionHandlers(httpServer);

// console.log(server);

httpServer.listen(PORT, () => {
  console.log(`Apollo server listening at http://localhost:5000`);
});
// }

// startApolloServer(schema);
