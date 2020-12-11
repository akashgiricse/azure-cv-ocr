const express = require("express");
const app = express();

// Body parser middleware
app.use(express.json({ extended: false, limit: "50mb" }));

app.get("/", (req, res) => res.send("API running"));

// Define Routes
app.use("/api/ocr", require("./routes/api/ocr"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server started on  http://localhost:${PORT}/`)
);

module.exports = app; // only for testing
