import Company from "../model/company.js";
import User from "../model/user.js";
import { setUser } from "../util/jwt.js";

const handleFetchCompanies = async (req, res) => {
  const { userId } = req.params;
  const companies = await Company.find({ createdBy: userId });
  if (companies.length < 0) {
    return res.status(400).send({ error: "NO COMPANIES FOUND!" });
  }
  return res.status(200).send({ message: "ok!", companies: companies });
};

const handleCreateCompany = async (req, res) => {
  const obj = req.body;
  const user = await User.findById(req.user._id);
  const company = new Company(obj);
  user.roleInfo.push({ role: "admin", company: company._id });
  await company.save();
  await user.save();

  const roleInfo = user.roleInfo.pop();
  user.company = {
    _id: company._id,
    name: company.name,
    role: roleInfo.role,
    branch: roleInfo.branch,
  };
  const token = setUser(user);
  res.cookie("JWT_TOKEN", token, {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  return res.status(200).send({
    message: "company created.",
    company: company,
  });
};

const handleSelectCompany = async (req, res) => {
  const { _id } = req.user;
  const { companyId } = req.query;
  const user = await User.findById(_id);
  const comp = await Company.findById(companyId);
  if (!comp) {
    return res.status(400).send({ error: "company not found!" });
  }
  const desiredComp = user.roleInfo.filter((item) => {
    return item.company.toString() === companyId.toString();
  });
  const roleInfo = desiredComp[0];
  user.company = {
    _id: comp._id,
    name: comp.name,
    role: roleInfo.role,
    branch: roleInfo.branch,
  };
  const token = setUser(user);
  res.cookie("JWT_TOKEN", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict", // Prevent CSRF
  });

  return res.status(200).send({
    message: "ok!",
    user: user,
    company: user.company,
  });
};

const handleGetCompanyById = async (req, res) => {
  const { companyId } = req.params;
  const comp = await Company.findById(companyId);
  return res.status(200).send({ message: "your company.", company: comp });
};

export {
  handleCreateCompany,
  handleFetchCompanies,
  handleGetCompanyById,
  handleSelectCompany,
};
