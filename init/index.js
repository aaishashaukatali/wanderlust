const mongoose = require("mongoose");
const Listing = require("../models/listings");
const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch((err) => {
    console.log("Error while connecting to DB.");
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((el) => ({
    ...el,
    owner: "6863e185d93a27dae7fdfe2d",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data initiliazed");
};

initDB();
