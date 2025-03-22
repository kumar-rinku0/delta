import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleCreateBranch,
  handleFetchBranches,
  handleCompanyAndBranchInfo,
} from "../controller/branch.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/create").post(wrapAsync(handleCreateBranch));
route
  .route("/userId/:userId/companyId/:companyId")
  .get(wrapAsync(handleCompanyAndBranchInfo));
route.route("/:companyId").get(wrapAsync(handleFetchBranches));

export default route;
