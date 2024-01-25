import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile?.username;
    }
    return false;
  }

  setMainPhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      if (photo) {
        await agent.Profiles.setMain(photo.id);
        store.userStore.setUserImage(photo.url);
        runInAction(() => {
          if (this.profile && this.profile.photos) {
            this.profile.photos.find((p) => p.isMain)!.isMain = false;
            this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
            this.profile.image = photo.url;
            this.loading = false;
          }
        });
      }
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loading = false;
      });
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.Profiles.upload(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            this.profile.image = photo.url;
            store.userStore.setUserImage(photo.url);
          }
          this.uploading = false;
        }
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.uploading = false;
      });
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.delete(photo.id);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos = this.profile.photos.filter(
            (p) => p.id !== photo.id
          );
          this.loading = false;
        }
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
