import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityFormValues } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { v4 as uuid } from "uuid";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    loadingInitial,
    loadActivity,
  } = activityStore;

  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required!"),
    description: Yup.string().required("Description is required!"),
    category: Yup.string().required(),
    date: Yup.string().required("Date is required!").nullable(),
    city: Yup.string().required(),
    venue: Yup.string().required(),
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(new ActivityFormValues(activity)));
  }, [id, loadActivity]);

  function handleFormSubmit(activity: ActivityFormValues) {
    if (!id) {
      activity.id = uuid();
      createActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    } else {
      updateActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading Activity..." />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />
            <MyTextArea name="description" rows={3} placeholder="Description" />
            <MySelectInput
              options={categoryOptions}
              name="category"
              placeholder="Category"
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:m aa"
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput name="city" placeholder="City" />
            <MyTextInput name="venue" placeholder="Venue" />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button floated="right" type="button" content="Cancel" />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
