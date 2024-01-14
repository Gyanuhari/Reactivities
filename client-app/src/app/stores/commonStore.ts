import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem("jwt");
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);

    // Runs automatically only when the token (first expression) value is changed.
    reaction(
      // First expression is whom we want to react to, here token, and the second expresson is the reaction that we want.
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem("jwt", token);
        } else {
          localStorage.removeItem("jwt");
        }
      }
    );
  }

  setServerError(error: ServerError) {
    this.error = error;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  setAppLoaded() {
    this.appLoaded = true;
  }
}
