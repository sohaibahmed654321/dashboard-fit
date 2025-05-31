let express = require("express");
let router = express.Router();
let {
  registerUser,
  getAllUsers,
  loginUser,
  forgot_pswd,
  resetPassword,
  getUserProfile,
  updateUserProfile // ✅ NEW IMPORT
} = require("../Controller/Logics");

router.post("/register", registerUser);
router.get("/users", getAllUsers);
router.post("/users/login", loginUser);
router.post("/users/forgot", forgot_pswd);
router.post("/users/resetpswd/:token", resetPassword);
router.get("/users/profile/:id", getUserProfile);
router.put("/users/profile/:id", updateUserProfile); // ✅ NEW ROUTE

module.exports = router;
