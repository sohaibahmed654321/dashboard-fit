let express = require("express");
let router = express.Router();
let { registerUser, getAllUsers, loginUser, forgot_pswd } = require("../Controller/Logics"); // ✅ Import added

router.post("/register", registerUser);
router.get("/users", getAllUsers);
router.post("/users/login", loginUser);
router.post("/users/forgot", forgot_pswd);
router.post("/users/resetpswd/:token", loginUser); // You can replace this with a real reset handler

module.exports = router;
