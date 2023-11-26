import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoose from "mongoose";
import clientRoutes from "./routes/client.js";
import salesRoutes from "./routes/sales.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";

// data import
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transactions.js";
import OverallStat from "./models/OverallStat.js";
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "./data/index.js";
import AffiliateStat from "./models/AffiliateStat.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));

/* ROUTES */
app.use("/client", clientRoutes);
app.use("/sales", salesRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);

/* MONGOOSE */
const port = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`Server Port: ${port}`));

    /* ONLY ADD DATA ONE TIME */
    // User.insertMany(dataUser);
    // Product.insertMany(dataProduct);
     //ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // OverallStat.insertMany(dataOverallStat);
    // AffiliateStat.insertMany(dataAffiliateStat);
  })
  .catch((error) => console.log(`${error} did not connect`));
