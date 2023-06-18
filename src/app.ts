import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";

// process.env.PWD = process.cwd();

export const app: Express = express();

// enable cors
// options for cors middleware
app.use(cors());
// app.use(express.static(`${process.env.PWD}/public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO: add HTTP request logger middleware (morgan)

app.get("/health-check", async (req, res) => {
  res.status(200).send("Congratulations! API is working!");
});
