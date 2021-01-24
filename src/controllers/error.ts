import { Request, Response, NextFunction } from "express";

const get404 = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Page Not Found." });
};

export default get404;
