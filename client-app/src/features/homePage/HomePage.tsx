import { Link } from "react-router-dom";
import { Header, Segment, Image, Container, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/loginForm";
import RegisterForm from "../users/registerForm";

export default observer(function HomePage() {
  const { userStore, modalStore } = useStore();

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        {userStore.isLoggedIn ? (
          <>
            <Header as="h2" inverted content="Welcome to Reactivities" />
            <Button
              as={Link}
              to="/activities"
              content="Go to activities"
              inverted
              size="huge"
            />
          </>
        ) : (
          <>
            <Button
              onClick={() => modalStore.openModal(<LoginForm />)}
              inverted
              size="huge"
            >
              Login!
            </Button>
            <Button
              onClick={() => modalStore.openModal(<RegisterForm />)}
              inverted
              size="huge"
            >
              Register
            </Button>
          </>
        )}
      </Container>
    </Segment>
  );
});
