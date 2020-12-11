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
  const key = process.env.KEY1;
  const endpoint = process.env.ENDPOINT;
  // const imgURL =
  //   "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/126259992/original/d377377b6758a398b9ab6cbe1d27fd536acfcca8/convert-any-handwritten-english-or-hindi-text-to-word-or-excel.jpg";
  // const imgURL =
  //   "https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg";
  // const imgURL =
  //   "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/MultiLingual.png";
  const imgURL =
    "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/MultiPageHandwrittenForm.pdf";

  axios({
    method: "post",
    url: endpoint,
    data: {
      url: imgURL,
    },
    headers: {
      "Ocp-Apim-Subscription-Key": key,
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
