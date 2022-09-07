import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { UserQueries } from "../../db";
import { tokenGenerator } from "../../utils";
import { logger } from "../../logger";

export class AuthController {

  static async registerController(req: Request, res: Response) {

    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      logger.error("Please Enter all the Feilds!");
      return res.status(400).json({error: true, detail: "Please Enter all the Feilds!"});
    }
  
    let rslt = await UserQueries.getUserByEmail(email);
  
    if (rslt.error) {
      logger.error("Unexpected error!")
      return res.status(500).json({error: true, detail: "Internal server error!"});
    } else if (!rslt.error && rslt.detail) {
      logger.error("User already exists!");
      return res.status(400).json({error: true, detail: "User already exists!"});
    };
  
    const hash = await bcrypt.hash(password, 10);
    rslt = await UserQueries.createUser({ name, email, password: hash, pic });
  
    if (rslt.error) {
      logger.error("Unexpected error!")
      return res.status(500).json({error: true, detail: "Internal server error!"});
    } else if(!rslt.error && !rslt.detail) {
      logger.error("User didn't created!");
      return res.status(400).json({error: true, detail: "User didn't created!"});
    } else {
      const user = rslt.detail;
      logger.info(`New user created, name: ${user.name} email: ${user.email}`)
      return res.status(201).json({
        error: false,
        detail: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          pic: user.pic,
          token: tokenGenerator({id: user._id.toString(), name: user.name, email: user.email})
        }
      });
    };

  };

  static async loginController(req: Request, res: Response) {

    const { email, password } = req.body;

    let rslt = await UserQueries.getUserByEmail(email);
  
    if (rslt.error) {
      logger.error("Unexpected error!")
      return res.status(500).json({error: true, detail: "Internal server error!"});
    } else if (!rslt.error && rslt.detail) {
      const user = rslt.detail;
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.status(200).json({
          error: false,
          detail: {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: tokenGenerator({id: user._id.toString(), name: user.name, email: user.email}),
          }
        });
      } else {
        return res.status(401).json({error: true, detail: "Invalid password!"});
      };
    } else {
      return res.status(401).json({error: true, detail: "This email doesn't exists!"});
    };

  };

};