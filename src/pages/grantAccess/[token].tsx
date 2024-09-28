import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDDialog from "@/components/basic/DnDDialog";
import DnDModal from "@/components/basic/DnDModal";
import DnDCharacterSheetCP from "@/components/characterviewer/DnDCharacterSheetCP";
import {
  useCharacter,
  useCharacters,
  useGame,
  useLoginData,
  usePlayer,
  useTick,
} from "@/utils/customHooks";
import { registerCharacterAsPlayer, savePlayer } from "@/utils/game";
import {
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

/**
 *
 * @returns Site to Show a Character
 */
export default function LevelUp() {
  const router = useRouter();
  var id: any = router.query.token;

  const { loggedIn, ready, user } = useLoginData("user");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  /**
   *
   * @param e Handels Login
   */
  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/user/checkPW", {
        username,
        password,
      });

      if (response.data.success) {
        // Erfolgreich eingeloggt
        window.location.reload();
      } else {
        if (response.status == 200) {
          setError(response.data.error);
        } else {
          setError("Interal server error");
        }
      }
    } catch (error) {
      setError("Ungültiger Benutzername oder Passwort");
    }
  };

  if (!ready) {
    return (
      <DnDDefaultPage
        error={error}
        setError={setError}
        children={
          <>
            <Typography>Loading....</Typography>
          </>
        }
        user={user}
        navBar={false}
      ></DnDDefaultPage>
    );
  }
  if ((ready && !loggedIn) || (ready && !user)) {
    return (
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form
            noValidate
            style={{
              width: "100%",
              marginTop: 1,
            }}
            onSubmit={handleLogin}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              component={Link}
              href="/forgot"
              fullWidth
              variant="text"
              color="secondary"
              sx={{
                marginTop: 2,
                marginBottom: 1,
              }}
            >
              Passwort vergessen?
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                marginBottom: 1,
              }}
            >
              Login
            </Button>
            <Typography
              component="h6"
              variant="h6"
              sx={{ textAlign: "center" }}
              color={"error"}
            >
              {error ? error : ""}
            </Typography>
          </form>
        </Paper>
      </Container>
    );
  }

  if (success) {
    return (
      <DnDDefaultPage navBar user={user} error={error} setError={setError}>
        <DnDModal
          onClose={() => {}}
          open={true}
          disableAbort
          disableCommit
          disableAnimation
        >
          <Typography variant="body1">
            Token {id} authorisiert. Du kannst diese Seite nun schließen.
          </Typography>
        </DnDModal>
      </DnDDefaultPage>
    );
  }

  return (
    <DnDDefaultPage navBar user={user} error={error} setError={setError}>
      <DnDModal
        onClose={() => {}}
        open={true}
        disableAbort
        disableCommit
        disableAnimation
      >
        <Typography variant="body1">
          Möchtest du den Token {id} Authorisieren?
        </Typography>
        <Button
          variant="outlined"
          onClick={async () => {
            await axios.get("/api/accessToken/createToken?token=" + id);
            setSuccess(true);
          }}
        >
          Authorisieren
        </Button>
      </DnDModal>
    </DnDDefaultPage>
  );
}
