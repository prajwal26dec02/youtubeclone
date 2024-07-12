import mongoose from "mongoose";
import users from "../models/auth.js";
import History from "../models/history.js";

export const updateChannelData = async (req, res) => {
  const { id: _id } = req.params;
  const { name, desc } = req.body;
  try {
    const updateData = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          name: name,
          desc: desc,
        },
      },
      { new: true }
    );
    res.status(200).json(updateData);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

export const getAllChannels = async (req, res) => {
  try {
    const allChannels = await users.find();
    const allChannelDetails = [];
    allChannels.forEach((channel) => {
      allChannelDetails.push({
        _id: channel._id,
        name: channel.name,
        email: channel.email,
        desc: channel.desc,
      });
    });
    res.status(200).json(allChannelDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updatePoints = async (req, res) => {
  const { id: _id } = req.params;
  const { videoId } = req.body;
  // console.log(id);
  try {
    const historyRecord = await History.findOne({ videoId: videoId });
    const file = await users.findById(_id);
    const pts = file.points;
    if (historyRecord) {
      res.status(200).json(file);
    } else {
      const updatePts = await users.findByIdAndUpdate(
        _id,
        {
          $set: {
            points: pts + 5,
          },
        },
        { new: true }
      );
      res.status(200).json(updatePts);
    }
    // console.log("Points updated - Server");
  } catch (error) {
    res.status(404).json({ message: error.message });
    // console.log(error);
  }
};
