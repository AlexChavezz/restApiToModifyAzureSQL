const { Router } = require("express");
const { getAllTable, pushNewUser } = require("../controllers/model.controllers");

const router = Router();

router.get("/", getAllTable);
router.post("/", pushNewUser);


module.exports = router;