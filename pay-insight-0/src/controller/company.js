import Company from "../model/company.js";
import User from "../model/user.js";

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
  const company = new Company({
    companyName: obj.companyName,
    companyAddress: obj.companyAddress,
    gstNo: obj.gstNo,
    cinNo: obj.cinNo,
  });
  // company.createdBy = user;
  user.companyWithRole.push({ role: obj.role, company: company });
  await company.save();
  await user.save();
  return res
    .status(200)
    .send({ message: "company created.", company: company, user: user });
};

const handleGetCompanyById = async (req, res) => {
  const { companyId } = req.params;
  const comp = await Company.findById(companyId);
  return res.status(200).send({ message: "your company.", company: comp });
};

export { handleCreateCompany, handleFetchCompanies, handleGetCompanyById };
