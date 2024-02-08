import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import databaseConnection from "./api/database/database.js";
import cors from "cors";
import bodyParser from "body-parser";
import chalk from "chalk";

// routes
import users from "./api/routes/user.route.js";
import posts from "./api/routes/post.route.js";
import lists from "./api/routes/list.route.js";

const server = express();
server.use(express.json());
server.use(cors());
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Database connection
databaseConnection();

// Routes
server.use("/api/users", users);
server.use("/api/post", posts);
server.use("/api/list", lists);

// root route
server.get("/", (req, res) => {
  res.json({
    status: "ok",
    app: "dev.sh",
    version: "0.0.5",
  });
});

// Ports config
const port = process.env.PORT || 3030;
server.listen(port, () => {
  console.log(chalk.blue("----------------------------------------------"));
  console.log(chalk.yellow(`--- Server listening on http://localhost:${port}`));
});
