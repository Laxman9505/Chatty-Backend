/** @format */
import { config } from "@root/config";
import { Request, Response } from "express";
import HTTP_STATUS from "http-status-codes";
import { joiValidation } from "@global/decorators/joi-validation.decorators";
import { authService } from "@service/db/auth.service";
import { BadRequestError } from "@global/helpers/error-handler";
import JWT from "jsonwebtoken";
import { loginSchema } from "@auth/schemas/signin";
import { IAuthDocument } from "@auth/interfaces/auth.interfaces";
import { IUserDocument } from "@user/interfaces/user.interface";
import { userService } from "@service/db/user.service";

export class Signin {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const checkIfUserExist: IAuthDocument = await authService.getUserByUsername(
      username
    );
    if (!checkIfUserExist) {
      throw new BadRequestError("Invalid Credentials !");
    }
    const passwordMatch: boolean = await checkIfUserExist.comparePassword(
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid Credentials !");
    }

    const user: IUserDocument = await userService.getUserByAuthId(
      `${checkIfUserExist._id}`
    );

    const userJWT: string = JWT.sign(
      {
        userIf: user._id,
        uId: checkIfUserExist.uId,
        email: checkIfUserExist.email,
        username: checkIfUserExist.username,
        avatarColor: checkIfUserExist.avatarColor,
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJWT };
    const userDocument: IUserDocument = {
      ...user,
      authId: checkIfUserExist._id,
      username: checkIfUserExist.username,
      email: checkIfUserExist.email,
      avatarColor: checkIfUserExist.avatarColor,
      uId: checkIfUserExist.uId,
      createdAt: checkIfUserExist.createdAt,
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({
      message: "User Login Successfully !",
      user: userDocument,
      token: userJWT,
    });
  }
}
