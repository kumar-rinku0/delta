const isRightId = (req, res, next) => {
  const { id, createdBy } = req.params;
  console.log(req.params);
  if (id.length != 24) {
    throw new ExpressError(400, "incorrect listing id!!");
  }
  if (createdBy && createdBy.length != 24) {
    throw new ExpressError(400, "bad requist, incorrect listing info!!");
  }
  return next();
};

module.exports = {
  isRightId,
};
