import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transactions.js";


export const getAdmin = async (req, res) => {
  try {
    const adminList = await User.find({ role: "admin" }).select("-password");
    console.log("admin required");
    res.status(200).json(adminList);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const userWithStats = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      { $unwind: "$affiliateStats" },
    ]);

    const saleTransaction = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        return Transaction.findById(id);
      })
    );
    const filteredSaleTransactions = saleTransaction.filter(
      (transaction) => transaction !== null
    );
    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransactions });
    //Why usserwithstats is returning an array.
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
