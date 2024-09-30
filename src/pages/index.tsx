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
 * @returns INDEX SITE -> RELOCATES TO DASHBOARD; LOGGIN OR SETUP DEPENDING ON COOKIE AND DATABASE
 */
function Index() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loggedIn, setLoggin] = useState(false);
	const [ready, setReady] = useState(false);
	const [toSetup, setToSetup] = useState(false);

	/**
	 * Loads Logindata from Database using Cookie
	 * If Cookie is found -> Dashboard
	 * If not -> Login
	 * If Database is not Setup yet -> Setup
	 */
	useEffect(() => {
		if (document.cookie === "") {
			setReady(true);
			setLoggin(false);
			return;
		}
		document.cookie.split(";").forEach(async (cookie) => {
			const [key, value] = cookie.split("=");
			if (key.trim() === "DM_c") {
				const response = await axios.post("/api/user/checkCookie", {
					cookie: value,
					role: "none",
				});
				if (response.data.error) {
					setLoggin(false);
					setReady(true);
					return;
				}
				setLoggin(true);
				setReady(true);
			}
			if (document.cookie.endsWith(value)) {
				setReady(true);
			}
		});

		const load = async () => {
			const res = await axios.get("/api/setup/setup");
			setToSetup(res.data.toSetup);
		};
		load();
	}, [router]);

	if (toSetup) {
		router.push("/setup");
		return <></>;
	}

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
	if (loggedIn && ready) {
		router.push("/dashboard");
		return <></>;
	}

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
				window.location.href = "/dashboard";
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

export default Index;
