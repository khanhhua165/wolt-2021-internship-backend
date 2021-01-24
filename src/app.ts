import { NewError } from "./controllers/discovery";
import express, { Request, Response, NextFunction } from "express";
import discoveryRoute from "./routes/discovery";
import errorController from "./controllers/error";

// *Initialize express app
const app = express();

// * CORS handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(discoveryRoute);

app.use((error: NewError, req: Request, res: Response, next: NextFunction) => {
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  const message = error.message;
  const statusCode = error.statusCode;
  res.status(statusCode).json({ message });
});

app.use(errorController);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
