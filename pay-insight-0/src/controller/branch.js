import Branch from "../model/branch.js";
import Company from "../model/company.js";
import User from "../model/user.js";
import { setUser } from "../util/jwt.js";

const handleFetchBranches = async (req, res) => {
  const { companyId } = req.params;
  const comp = await Company.findById(companyId);
  if (!comp) {
    return res.status(400).send({ message: "WRONG COMPANY ID!" });
  }
  const branches = await Branch.find({ company: companyId });
  if (branches.length < 0) {
    return res.status(400).send({ message: "NO BRANCHES FOUND!" });
  }
  return res
    .status(200)
    .send({ message: "ok!", branches: branches, company: comp });
};

const handleCompanyAndBranchInfo = async (req, res) => {
  const { userId, companyId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).send({ message: "WRONG USER ID!" });
  }
  const comp = await Company.findById(companyId);
  if (!comp) {
    return res.status(400).send({ message: "WRONG COMPANY ID!" });
  }
  const branches = await Branch.find({ company: companyId });
  comp.branch = branches;
  user.company = comp;
  const token = setUser(user);
  res.cookie("_session_token", token, {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  return res
    .status(200)
    .send({ message: "ok!", user: user, branches: branches, company: comp });
};

const handleCreateBranch = async (req, res) => {
  const obj = req.body;
  const user = await User.findById(obj._id);
  if (!user) {
    return res.status(400).send({ message: "user not found!" });
  }
  const comp = await Company.findById(obj.company);
  if (!comp) {
    return res.status(400).send({ message: "company not found!" });
  }
  const branch = new Branch({
    branchName: obj.branchName,
    attendanceRadius: obj.attendanceRadius,
    branchAddress: obj.branchAddress,
    branchGeometry: obj.branchGeometry,
  });
  branch.createdBy = user;
  branch.company = comp;
  await branch.save();
  return res.status(200).send({ message: "branch created.", branch: branch });
};

export { handleCreateBranch, handleFetchBranches, handleCompanyAndBranchInfo };
