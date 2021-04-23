import express from "express";
import { getMedia, writeMedia } from "../lib/media.services.js";
import { v4 as uuid } from "uuid";
import { check, validationResult } from "express-validator";

const router = express.Router();

const middlewareValidator = [
  check("Title").exists().withMessage("Title can't be empty!"),
  check("Year").exists().withMessage("Year can't be empty!"),
  check("imdbID").exists().withMessage("imdbID can't be empty!"),
  check("Type").exists().withMessage("Type can't be empty!"),
  check("Poster").exists().withMessage("Poster can't be empty!"),
];

//GET ALL MOVIES

router.get("/", async (req, res, next) => {
  try {
    const media = await getMedia();
    res.send(media);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//GET A MOVIE

router.get("/:imdbID/", async (req, res, next) => {
  try {
    const medias = await getMedia();
    const media = medias.find((media) => media.imdbID === req.params.imdbID);
    res.send(media);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//POST A NEW MOVIE

router.post("/", middlewareValidator, async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const err = new Error();
      err.errorList = error;
      err.statusCode = 400;
      next(err);
    } else {
      const media = await getMedia();
      const newMedia = {
        ...req.body,
      };
      media.push(newMedia);
      await writeMedia(media);
      res.send("Movie added successfully");
    }
  } catch (error) {
    next(error);
    console.log("Error on catch");
  }
});

//DELETE A PARTICULAR MOVIE

router.delete("/:imdbID/", async (req, res, next) => {
  try {
    const media = await getMedia();
    const newMediaArray = media.filter(
      (movie) => movie.imdbID !== req.params.imdbID
    );
    if (media.length === newMediaArray.length) {
      const err = new Error();
      err.message = "Movie does not exist";
      err.statusCode = 404;
      next(err);
    } else {
      await writeMedia(newMediaArray);
      res.send("Movie deleted successfully");
    }
  } catch (error) {
    console.log("ERROR DELETING");
    next(error);
  }
});

export default router;
