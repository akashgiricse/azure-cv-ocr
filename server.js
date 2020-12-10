const express = require("express");
const app = express();

// Body parser middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

// Define Routes
app.use("/api/orc", require("./routes/api/ocr"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app; // only for testing
