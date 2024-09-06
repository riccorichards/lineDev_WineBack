import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import config from "../../config";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const createServer = () => {
  const app = express();
  app.use(limiter);
  app.use(morgan("combined"));
  dotenv.config();
  app.use(helmet());
  app.use(express.json());
  app.use(
    cors({
      origin: config.origin,
      credentials: true,
    })
  );

  return app;
};

export default createServer;
