import Branch from "../model/branch.js";
import Company from "../model/company.js";
import User from "../model/user.js";

const handleFetchBranches = async (req, res) => {
  const companyId = req.user.company._id;
  const comp = await Company.findById(companyId);
  const branches = await Branch.find({ company: companyId });
  if (branches.length === 0) {
    return res.status(400).json({ error: "NO BRANCHES FOUND!" });
  }
  return res
    .status(200)
    .send({ message: "ok!", branches: branches, company: comp });
};

const handleCreateBranch = async (req, res) => {
  const obj = req.body;
  const user = await User.findById(obj._id);
  if (!user) {
    return res.status(400).send({ error: "user not found!" });
  }
  const comp = await Company.findById(obj.company);
  if (!comp) {
    return res.status(400).send({ error: "company not found!" });
  }
  const branch = new Branch({
    name: obj.name,
    radius: obj.radius,
    address: obj.address,
  });
  if (obj.isCoordinates) {
    branch.geometry = obj.geometry;
  } else {
    obj.geometry = {
      type: "Point",
      coordinates: [0, 0],
    };
  }
  branch.geometry = obj.geometry;
  branch.createdBy = user;
  branch.company = comp;
  await branch.save();
  return res.status(200).send({ message: "branch created.", branch: branch });
};

export { handleCreateBranch, handleFetchBranches };
