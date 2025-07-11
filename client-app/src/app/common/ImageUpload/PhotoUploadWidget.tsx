import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import "cropperjs/dist/cropper.css";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}

export default observer(function PhotoUploadWidget({
  loading,
  uploadPhoto,
}: Props) {
  const [files, setFiles] = useState<Blob[]>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((file) => uploadPhoto(file!));
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.createObjectURL(file));
    };
  }, [files]);

  // useEffect(() => {
  //   return () => {
  //     files.forEach((file) => URL.createObjectURL(file).preview);
  //   };
  // }, [files]);

  return (
    <>
      <Grid>
        <Grid.Row />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 1 - Add Photo" />
          <PhotoWidgetDropzone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize Image" />
          {files && files.length > 0 && (
            <PhotoWidgetCropper
              setCropper={setCropper}
              //imagePreview={files[0].preview}
              imagePreview={URL.createObjectURL(files[0])}
            />
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview & Upload" />
          <div
            className="img-preview"
            style={{ minHeight: 200, overflow: "hidden" }}
          />
          {files && files.length > 0 && (
            <Button.Group widths={2}>
              <Button
                loading={loading}
                onClick={onCrop}
                positive
                icon="check"
              />
              <Button
                disabled={loading}
                onClick={() => setFiles([])}
                icon="close"
              />
            </Button.Group>
          )}
        </Grid.Column>
      </Grid>
    </>
  );
});
