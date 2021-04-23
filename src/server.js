import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import reviewsRoute from "../src/routes/reviews.js";
import mediaRoute from "../src/routes/media.js";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

const whitelist = [process.env.FE_URL_DEV, process.env.FE_URL_PROD]; // You NEED to configure it manually on Heroku

const corsOptions = {
  origin: function (origin, next) {
    if (whitelist.indexOf(origin) !== -1) {
      console.log("ORIGIN ", origin);
      // origin found in whitelist
      next(null, true);
    } else {
      // origin not found in the whitelist
      next(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use("/reviews", reviewsRoute);
app.use("/media", mediaRoute);

console.log(listEndpoints(app));

app.listen(PORT, () => {
  console.log(`Server online on port ${PORT}`);
});
