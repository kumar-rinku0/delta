import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleCreateCompany,
  handleFetchCompanies,
  handleGetCompanyById,
} from "../controller/company.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/create").post(wrapAsync(handleCreateCompany));
route
  .route("/getOneByCompanyId/:companyId")
  .get(wrapAsync(handleGetCompanyById));
route.route("/:userId").get(wrapAsync(handleFetchCompanies));

export default route;
