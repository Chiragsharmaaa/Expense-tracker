const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const morgan = require("morgan");
const mongoose = require('mongoose')
const path = require("path");
dotenv.config();

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumFeaturesRoutes = require("./routes/premiumFeatures");
const forgotPasswordRoutes = require("./routes/forgotpassword");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json({ extended: false }));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/payment", purchaseRoutes);
app.use("/premium", premiumFeaturesRoutes);
app.use("/password", forgotPasswordRoutes);

mongoose.connect(process.env.CONN_STR).then(() => {
  console.log("Database connected!");
  app.listen(process.env.PORT, () => {
    console.log(`Server started at port: ${process.env.PORT}`);
  });
}).catch((err) => {
  console.log("Error: ", err);
});
