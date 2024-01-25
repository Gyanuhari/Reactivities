import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      store.modalStore.closeModal();
      router.navigate("/activities");
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    this.user = null;
    router.navigate("/");
  };

  register = async (creds: UserFormValues) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await agent.Account.register(creds);
      runInAction(() => {
        this.user = user;
      });
      store.commonStore.setToken(user.token);
      store.modalStore.closeModal();
      router.navigate("/activities");
    } catch (error) {
      throw error;
    }
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  setUserImage = (image: string) => {
    if (this.user) {
      this.user.image = image;
    }
  };
}
