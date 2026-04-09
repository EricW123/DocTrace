const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/compare", (req, res) => {
  const { v1, v2 } = req.body;

  const added = v2.includes("c") ? ["c"] : [];
  const removed = [];

  res.json({
    added,
    removed,
    summary: "mock result"
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});