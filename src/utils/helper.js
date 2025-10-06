const validator = require("validator");

const validateSignUpUser = (req) => {
  const { firstName, lastName, emailId } = req.body;
  if (!firstName || !lastName) throw new Error("Name is not Valid");
  if (!validator.isEmail(emailId)) throw new Error("Email is not Valid");
};

const validateEditUser = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).forEach((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpUser,
  validateEditUser,
};
