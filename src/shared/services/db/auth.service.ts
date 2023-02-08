/** @format */

import { IAuthDocument } from "@auth/interfaces/auth.interfaces";
import { AuthModel } from "@auth/models/auth.schema";
import { Helpers } from "@global/helpers/helpers";

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }
  public async getUserByUsernameorEmail(
    username: string,
    email: string
  ): Promise<IAuthDocument> {
    const query = {
      $or: [
        { username: Helpers.firstLetterUppercase(username) },
        { email: Helpers.lowerCase(email) },
      ],
    };
    const user: IAuthDocument = (await AuthModel.findOne(
      query
    ).exec()) as IAuthDocument;
    return user;
  }
  public async getUserByUsername(username: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({
      username: Helpers.firstLetterUppercase(username),
    }).exec()) as IAuthDocument;
    return user;
  }
}

const authService: AuthService = new AuthService();
export { authService };
