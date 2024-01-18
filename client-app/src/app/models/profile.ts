import { User } from "./user";

export interface IProfile {
  displayName: string;
  username: string;
  image?: string;
  bio?: string;
}

export class Profile implements IProfile {
  displayName: string;
  username: string;
  image?: string;
  constructor(user: User) {
    this.displayName = user.displayName;
    this.username = user.username;
    this.image = user.image;
  }
}
