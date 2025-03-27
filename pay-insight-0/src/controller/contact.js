import Contact from "../model/contact.js";

const handleCreateContact = async (req, res) => {
  try {
    const { name, mobile, companyCode, comments } = req.body;

    if (!name || !mobile || !companyCode || !comments) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newContact = new Contact({
      name,
      mobile,
      companyCode,
      comments,
    });

    await newContact.save();

    return res.status(201).json({ message: "Contact submitted successfully" });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", logs: error });
  }
};

export { handleCreateContact };
