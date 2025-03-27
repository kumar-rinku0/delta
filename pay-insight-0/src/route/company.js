import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleCreateCompany,
  handleFetchCompanies,
  handleGetCompanyById,
  handleSelectCompany,
} from "../controller/company.js";

const route = Router();
import { onlyAdminUser } from "../middleware/auth.js";

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/create").post(wrapAsync(handleCreateCompany));
route.route("/select").get(wrapAsync(handleSelectCompany));

route
  .route("/getOneByCompanyId/:companyId")
  .get(wrapAsync(handleGetCompanyById));

route.route("/:userId").get(wrapAsync(handleFetchCompanies));

export default route;
