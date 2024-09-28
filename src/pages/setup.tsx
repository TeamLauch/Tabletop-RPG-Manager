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
import { useEffect, useState } from "react";

/**
 *
 * @returns Setup Site -> If already Setup -> To Login
 */
function Setup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [setup, setSetuped] = useState(false);
  const [ready, setReady] = useState(false);

  /**
   * Checks whether it is setup or not
   */
  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/api/admin/setup");
      setSetuped(!res.data.toSetup);
      setReady(true);
    };
    load();
  }, [router]);

  if (!ready) {
    return (
      <div
        style={{
          backgroundImage: 'url("/background_index.jpg")',
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <div style={{ flex: 1 }}>
          <Typography>Loading...</Typography>
        </div>
      </div>
    );
  }
  if (setup && ready) {
    router.push("/");
    return <></>;
  }

  /**
   * Handels setup
   * Stores a Key inside Database and creates a User
   * @param e Event
   */
  const handleSetup = async (e: any) => {
    e.preventDefault();

    const response = await axios.post("/api/admin/setup", {
      username,
      password,
    });
    window.location.href = "/";
    if (response.status == 200) {
      setError(response.data.error);
    } else {
      setError("Interal server error");
    }
  };

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
          Setup
        </Typography>
        <form
          noValidate
          style={{
            width: "100%",
            marginTop: 1,
          }}
          onSubmit={handleSetup}
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
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              marginBottom: 1,
            }}
          >
            Setup
          </Button>
          <Typography
            component="h6"
            variant="h6"
            sx={{ textAlign: "center" }}
            color={"error"}
          >
            {error}
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}

export default Setup;
