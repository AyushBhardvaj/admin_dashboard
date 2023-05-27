import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transactions.js";
import User from "../models/User.js";
import getCountryISO3 from "country-iso-2-to-3";

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productswithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc, //This return statement is combining the producct and product stats.
          stat,
        };
      })
    );
    res.status(200).json(productswithStats);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "dsc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    //formatted sort would look like {userId: -1}
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" }, //Why name is used here.
    });
    res.status(200).json({ transactions, total });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryISO3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );
    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export { getProducts, getCustomers, getTransactions, getGeography };
