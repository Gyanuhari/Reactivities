import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { useStore } from "../../app/stores/store";
import PhotoUploadWidget from "../../app/common/ImageUpload/PhotoUploadWidget";

interface Props {
  profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState("");
  const {
    profileStore: {
      isCurrentUser,
      setMainPhoto,
      uploadPhoto,
      deletePhoto,
      loading,
      uploading,
    },
  } = useStore();

  function handleSetMainPhoto(
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  }

  function handleUploadPhoto(photo: Blob) {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  }

  function handleDeletePhoto(
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              onClick={() => setAddPhotoMode(!addPhotoMode)}
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadPhoto}
              loading={uploading}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        basic
                        color="green"
                        content="Main"
                        name={"main" + photo.id}
                        disabled={photo.isMain}
                        loading={loading && target === "main" + photo.id}
                        onClick={(e) => handleSetMainPhoto(photo, e)}
                      />
                      <Button
                        name={photo.id}
                        basic
                        color="red"
                        icon="trash"
                        disabled={photo.isMain}
                        loading={loading && target === photo.id}
                        onClick={(e) => handleDeletePhoto(photo, e)}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
