import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const connection = mongoose.connection;
const conection = () => {
  if (connection.readyState >= 1) {
    console.log("alerady connected to database!!!");
    return;
  }
  console.log("connecting to database!!!");
  mongoose
    .connect(MONGODB_URI)
    .then((res) => {
      console.log("conected!!");
      return res;
    })
    .catch((err: Error) => {
      console.error(err);
    });
};

export default conection;
