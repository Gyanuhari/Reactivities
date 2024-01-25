import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import ProfileContent from "./ProfileContent";

export default observer(function ProfilePage() {
  const { profileStore } = useStore();
  const { profile, loadingProfile, loadProfile } = profileStore;
  const { username } = useParams();

  useEffect(() => {
    if (username) {
      loadProfile(username);
    }
  }, [username, loadProfile]);

  if (loadingProfile) return <LoadingComponent content="Loading Profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});
