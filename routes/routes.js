import { Router } from "express";
import express from "express";
const router = express.Router();

// application status
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

// db status
router.get('/db-status', async(req, res) => {
    const db = req.app.locals.db;
    if(!db){
        throw new Error("Database not initialized");
    }else{
        res.status(200).json({
            message: "MongoDB connection is active",
            databaseName: db.databaseName,
        });
    }
})


export default router;