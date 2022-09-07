import { UserModel } from "../models";
import { tryToCatch } from "../utils";

export class UserQueries {

  static async createUser(payload: object) {
    const [error, data] = await tryToCatch(
      async (payload: object) => await UserModel.create(payload), payload);

      return error ? { error: true, detail: error } : { error: false, detail: data };
  };

  static async getUserByEmail(email: string) {
    const [error, data] = await tryToCatch(
      async (email: string) => UserModel.findOne({ email }).lean(), email);

    return error ? { error: true, detail: error } : { error: false, detail: data };
  };

  static async getUserById(id: string) {
    const [error, data] = await tryToCatch(
      async (id: string) => UserModel.findById(id).lean(), id);

    return error ? { error: true, detail: error } : { error: false, detail: data };
  };

};