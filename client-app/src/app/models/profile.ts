import { User } from "./user";

export interface IProfile {
  displayName: string;
  username: string;
  image?: string;
  bio?: string;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

export class Profile implements IProfile {
  displayName: string;
  username: string;
  image?: string;
  photos?: Photo[];
  constructor(user: User) {
    this.displayName = user.displayName;
    this.username = user.username;
    this.image = user.image;
  }
}
