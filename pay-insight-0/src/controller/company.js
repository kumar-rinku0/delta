import Company from "../model/company.js";
import User from "../model/user.js";
import { setUser } from "../util/jwt.js";

const handleFetchCompanies = async (req, res) => {
  const { userId } = req.params;
  const companies = await Company.find({ createdBy: userId });
  if (companies.length < 0) {
    return res.status(400).send({ message: "NO COMPANIES FOUND!" });
  }
  return res.status(200).send({ message: "ok!", companies: companies });
};

const handleCreateCompany = async (req, res) => {
  const obj = req.body;
  const user = await User.findById(obj._id);
  if (!user) {
    return res.status(400).send({ message: "login first!" });
  }
  const company = new Company(obj);
  // company.createdBy = user;
  user.companyWithRole.push({ role: "admin", company: company._id });
  await company.save();
  await user.save();
  user.company = company;
  user.roleInfo = user.companyWithRole.pop();
  const token = setUser(user);
  res.cookie("_session_token", token, {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  return res.status(200).send({
    message: "company created.",
    company: company,
    roleInfo: user.roleInfo,
  });
};

const handleGetCompanyById = async (req, res) => {
  const { companyId } = req.params;
  const comp = await Company.findById(companyId);
  return res.status(200).send({ message: "your company.", company: comp });
};

export { handleCreateCompany, handleFetchCompanies, handleGetCompanyById };
