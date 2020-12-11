require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

// @router  POST api/ocr
// @desc    Get Text
// @access  Public
router.post("/", async (req, res) => {
  const key = process.env.KEY1;
  const endpoint = process.env.ENDPOINT;
  const imgURL =
    "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/126259992/original/d377377b6758a398b9ab6cbe1d27fd536acfcca8/convert-any-handwritten-english-or-hindi-text-to-word-or-excel.jpg";

  axios({
    method: "post",
    url: endpoint,
    data: {
      url: imgURL,
    },
    headers: {
      "Ocp-Apim-Subscription-Key": key,
    },
  }).then((post_response) => {
    let operation_location = post_response.headers["operation-location"];

    axios({
      method: "get",
      url: operation_location,
      headers: {
        "Ocp-Apim-Subscription-Key": key,
      },
    }).then((get_response) => {
      console.log("get_response is ", get_response.data);
      res.status(200).json(get_response.data);
    });
  });
});

module.exports = router;
