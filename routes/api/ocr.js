require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const sleep = require("util").promisify(setTimeout);
const STATUS_SUCCEEDED = "succeeded";

// @router  POST api/ocr
// @desc    Get Text
// @access  Public
router.post("/", async (req, res) => {
  const base64 = req.body.base64;
  const data = Buffer.from(base64, "base64");

  const key = process.env.KEY1;
  const endpoint = process.env.ENDPOINT;

  axios({
    method: "post",
    url: endpoint,
    data,
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/octet-stream",
    },
  }).then(async (post_response) => {
    let operation_location = post_response.headers["operation-location"];

    let get_response = await axios({
      method: "get",
      url: operation_location,
      headers: {
        "Ocp-Apim-Subscription-Key": key,
      },
    });

    let status = get_response.data.status;
    let result = get_response.data.analyzeResult;

    while (status !== STATUS_SUCCEEDED) {
      await sleep(1000);
      let get_response = await axios({
        method: "get",
        url: operation_location,
        headers: {
          "Ocp-Apim-Subscription-Key": key,
        },
      });

      status = get_response.data.status;
      result = get_response.data.analyzeResult;
    }

    let return_obj = [];

    for (let i = 0; i < result.readResults.length; i++) {
      let page_details = {};
      let lines = [];
      page_details.page = result.readResults[i].page;

      result.readResults[i].lines.map((line) => {
        lines.push(line.text);
      });

      page_details.lines = lines.join(" ");

      return_obj.push(page_details);
    }

    res.status(200).json(return_obj);
  });
});

module.exports = router;
