import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transactions.js";
import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    //hardcoded values
    const currentMonth = "November";
    const currentYear = 2021;
    const currentDay = "2021-11-15";

    // Recent Transactions
    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdAt: -1 });

    const overallStat = await OverallStat.find({ year: currentYear });

    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      dailyData,
      salesByCategory,
    } = overallStat[0];

    const thisMonthStats = monthlyData.find(({ month }) => {
      return month === currentMonth;
    });

    const todayStats = dailyData.find(({ date }) => {
      return date === currentDay;
    });

    res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      dailyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
      transactions,
    });
    
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
