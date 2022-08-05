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

//For subscriptions
// const { SubscriptionServer } = require("subscriptions-transport-ws");
// const { execute, subscribe } = require("graphql");
// const httpServer = http.createServer(app);

// (async function () {
//   const server = new ApolloServer({
//     schema,
//   });
//   await server.start();
//   server.applyMiddleware({ app });

//   SubscriptionServer.create(
//     { schema, execute, subscribe },
//     { server: httpServer, path: server.graphqlPath }
//   );

//   const PORT = 5000;
//   httpServer.listen(PORT, () =>
//     console.log(`Server is now running on http://localhost:${PORT}/graphql`)
//   );
// })();

//Original
// async function startApolloServer() {
//   const server = new ApolloServer({
//     schema,
//     playground: true,
//     context: ({ req }) => {
//       let { userId, isAuth } = req;

//       return {
//         req,
//         userId,
//         isAuth,
//       };
//     },
//   });
//   await server.start();
//   server.applyMiddleware({
//     app,
//     path: "/graphql",
//   });

//   // Modified server startup
//   await new Promise((resolve) => app.listen({ port: 5000 }, resolve));
//   console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
// }

// startApolloServer();
