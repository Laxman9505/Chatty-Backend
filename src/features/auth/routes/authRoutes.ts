/** @format */
import { Signin } from "@auth/controllers/signin";
import { SignOut } from "@auth/controllers/signout";
import { signUp } from "@auth/controllers/signup";
import express, { Router } from "express";

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post("/signup", signUp.prototype.create);
    this.router.post("/signin", Signin.prototype.read);
    return this.router;
  }

  public signoutRoute(): Router {
    this.router.get("/signout", SignOut.prototype.update);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
