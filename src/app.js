require("dotenv").config();
require("./utils/cronJob");
const { initializeSocket } = require("./utils/socket");
const http = require("http");
const express = require("express");
const { dbConnect } = require("../src/config/database");
const { User } = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routers/auth");
const { profileRouter } = require("./routers/profile");
const { requestRouter } = require("./routers/request");
const { chatRouter } = require("./routers/chat");
const { userRouter } = require("./routers/user");
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);
dbConnect()
  .then((res) => {
    console.log("Database connected successfully!");
    server.listen(process.env.PORT, () => {
      console.log("Server is listening! ");
    });
  })
  .catch((err) => {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  });
