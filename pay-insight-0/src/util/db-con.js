import mongoose from "mongoose";

export const connectDatabase = (MONGO_URI) => {
  console.log("connecting to database!");
  mongoose
    .connect(MONGO_URI)
    .then((res) => {
      console.log("connection successful.");
      //   return res;
    })
    .catch((err) => {
      console.log(err);
      //   return err;
    });
};
