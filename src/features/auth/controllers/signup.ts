/** @format */

import { ObjectId } from "mongodb";
import { joiValidation } from "@global/decorators/joi-validation.decorators";
import { signupSchema } from "@auth/schemas/signup";
import { Request, Response } from "express";
import { IAuthDocument, ISignUpData } from "@auth/interfaces/auth.interfaces";
import { authService } from "@service/db/auth.service";
import { BadRequestError } from "@global/helpers/error-handler";
import { Helpers } from "@global/helpers/helpers";
import { UploadApiResponse } from "cloudinary";
import { uploads } from "@global/helpers/cloudinary-upload";
import HTTP_STATUS from "http-status-codes";
import { IUserDocument } from "@user/interfaces/user.interface";
import { UserCache } from "@service/redis/user.cache";
import { config } from "@root/config";
import { omit } from "lodash";
import { authQueue } from "@service/queues/auth.queue";
import { userQueue } from "@service/queues/user.queue";
import JWT from "jsonwebtoken";

const userCache: UserCache = new UserCache();

export class signUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response) {
    const { username, password, email, avatarColor, avatarImage } = req.body;
    const checkIfUserAlreadyExist: IAuthDocument =
      await authService.getUserByUsernameorEmail(username, email);
    if (checkIfUserAlreadyExist) {
      throw new BadRequestError("Invalid Credentials");
    }
    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`;
    const authData: IAuthDocument = signUp.prototype.singupData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor,
    });

    const result: UploadApiResponse = (await uploads(
      avatarImage,
      `${userObjectId}`,
      true,
      true
    )) as UploadApiResponse;

    if (!result?.public_id) {
      throw new BadRequestError(`File Upload: Error Occured. Try again.`);
    }

    // Add to redis cache

    const userDataForCache: IUserDocument = signUp.prototype.userData(
      authData,
      userObjectId
    );
    userDataForCache.profilePicture = `https://res/cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    // Add to database

    omit(userDataForCache, [
      "uId",
      "username",
      "email",
      "avatarColor",
      "password",
    ]);
    authQueue.addAuthUserJob("addAuthUserToDB", { value: userDataForCache });
    userQueue.addUserJob("addUserToDB", { value: userDataForCache });
    const userJWT: string = signUp.prototype.singupToken(
      authData,
      userObjectId
    );
    req.session = { jwt: userJWT };
    res.status(HTTP_STATUS.CREATED).json({
      message: "User Created Successfully !",
      user: userDataForCache,
      token: userJWT,
    });
  }

  private singupToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor,
      },
      config.JWT_TOKEN!
    );
  }

  private singupData(data: ISignUpData): IAuthDocument {
    const { _id, username, email, uId, password, avatarColor } = data;

    return {
      _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowerCase(email),
      password,
      avatarColor,
      createdAt: new Date(),
    } as IAuthDocument;
  }
  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: "",
      blocked: [],
      blockedBy: [],
      work: "",
      location: "",
      school: "",
      quote: "",
      bgImageVersion: "",
      bgImageId: "",
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true,
      },
      social: {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
      },
    } as unknown as IUserDocument;
  }
}
