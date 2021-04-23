import express from "express";
import { getReviews, writeReviews } from "../lib/reviews.services.js";
import { v4 as uuid } from "uuid";
import { check, validationResult } from "express-validator";

const router = express.Router();

const middlewareValidator = [
  check("comment").exists().withMessage("Comment can't be empty!"),
  check("rate").exists().isInt().withMessage("Choose a rate between 1 and 5!"),
];

//GET ALL REVIEWS FOR A MOVIE

router.get("/:imdbID", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const review = reviews.filter(
      (review) => review.imdbID === req.params.imdbID
    );
    res.send(review);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//GET A SINGLE REVIEW FROM A MOVIE

router.get("/:imdbID/:_id", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const review = reviews.find((review) => review._id === req.params._id);
    res.send(review);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//POST A NEW MOVIE

router.post("/:imdbID", middlewareValidator, async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const err = new Error();
      err.errorList = error;
      err.statusCode = 400;
      next(err);
    } else {
      const reviews = await getReviews();
      const newReview = {
        ...req.body,
        _id: uuid(),
        imdbID: req.params.imdbID,
        createdAt: new Date(),
      };
      reviews.push(newReview);
      await writeReviews(reviews);
      res.send("Review added successfully");
    }
  } catch (error) {
    next(error);
    console.log("Error on catch");
  }
});

//DELETE A PARTICULAR REVIEW

router.delete("/:imdbID/:_id", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const newReviewsArray = reviews.filter(
      (review) => review._id !== req.params._id
    );
    if (reviews.length === newReviewsArray.length) {
      const err = new Error();
      err.message = "Review does not exist";
      err.statusCode = 404;
      next(err);
    } else {
      await writeReviews(newReviewsArray);
      res.send("Review deleted successfully");
    }
  } catch (error) {
    console.log("ERROR DELETING");
    next(error);
  }
});

export default router;
