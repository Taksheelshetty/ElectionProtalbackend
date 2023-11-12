const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./Routes/Routes.router");
const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
};

const app = express();
const port = 3001;

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
