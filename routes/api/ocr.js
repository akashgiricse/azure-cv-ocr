const express = require("express");
const router = express.Router();

// @router  POST api/ocr
// @desc    Get Text
// @access  Public
router.post("/", async (req, res) => {
  const { url } = req.body;
});

module.exports = router;
