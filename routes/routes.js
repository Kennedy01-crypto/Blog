import { Router } from "express";
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      message: "The Blog Application is Running!!",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error! Application not Running",
    });
  }
});


export default router;