/** @format */
import { CurrentUser } from "@auth/controllers/current-user";
import { authMiddleware } from "@global/helpers/auth-middleware";
import express, { Router } from "express";

class CurrentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post(
      "/currentuser",
      authMiddleware.checkAuthentication,
      CurrentUser.prototype.read
    );
    return this.router;
  }
}

export const currentUserRoutes: CurrentRoutes = new CurrentRoutes();
