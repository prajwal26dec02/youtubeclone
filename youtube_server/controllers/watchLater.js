import WatchLater from "../models/watchLater.js";
import mongoose from "mongoose";

export const watchLaterController = async (req, res) => {
  const watchLaterData = req.body;

  //   console.log(likedVideoData);
  const addToWatchLater = new WatchLater(watchLaterData);

  try {
    await addToWatchLater.save();
    res.status(200).json("added to watchLaterVideo");
    console.log("Done");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllwatchLaterController = async (req, res) => {
  try {
    const files = await WatchLater.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const deleteWatchLaterController = async (req, res) => {
  const { videoId: videoId, Viewer: Viewer } = req.params;
  try {
    await WatchLater.findOneAndDelete({
      videoId: videoId,
      Viewer: Viewer,
    });
    res.status(200).json({ message: "Removed from your watch laters" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
