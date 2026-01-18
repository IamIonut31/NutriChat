import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ httpMethod: "GET", message: "User route is working!" });
});

router.post("/", (req, res) => {
  res.json({ httpMethod: "POST", message: "User route is working!" });
});

router.put("/", (req, res) => {
  res.json({ httpMethod: "PUT", message: "User route is working!" });
});

router.delete("/", (req, res) => {
  res.json({ httpMethod: "DELETE", message: "User route is working!" });
});

export default router;