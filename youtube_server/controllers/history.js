import History from "../models/history.js";
import mongoose from "mongoose";

export const historyController = async (req, res) => {
  const historyData = req.body;
  const addToHistory = new History(historyData);

  try {
    await addToHistory.save();
    res.status(200).json("added to historyVideo");
    // console.log("Done");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllhistoryController = async (req, res) => {
  try {
    const files = await History.find({ isActive: true });
    res.status(200).send(files);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const deleteHistoryController = async (req, res) => {
  const { userId: userId } = req.params;
  try {
    await History.updateMany(
      {
        Viewer: userId,
      },
      { $set: { isActive: false } }
    );
    res.status(200).json({ message: "History marked inactive" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
