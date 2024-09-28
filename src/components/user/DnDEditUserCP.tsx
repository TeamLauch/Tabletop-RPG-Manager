import {
	Button,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DnDEditPaper } from "../basic/DnDStyledComponents";

/**
 *
 * @param u Data of the User => undefined = New User
 * @param handleSave Function for Handling Saving
 * @param cancle Function for Canceling Saving
 * @returns A Component for Editing Users
 */
export default function DnDEditUserCp({
	u,
	handleSave,
	cancel,
}: {
	u: any;
	handleSave: any;
	cancel: any;
}) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [pwChanged, setPWChanges] = useState(false);
	const [activated, setActivated] = useState(true);
	const [role, setRole] = useState("user");

	/**
	 * Writes the date from u into the States
	 */
	useEffect(() => {
		if (u) {
			setUsername(u.username);
			setRole(u.roles);
			setEmail(u.email);
			setActivated(u.activated);
			setPWChanges(false);
			return;
		}
		setPWChanges(true);
	}, [u]);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<DnDEditPaper
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
					{u ? "Bearbeite" : "Erstelle"} Benutzer
				</Typography>
				<form
					noValidate
					style={{
						width: "100%",
						marginTop: 1,
					}}
					onSubmit={() => {
						handleSave({
							username,
							password,
							email,
							role,
							pwChanged,
							activated,
						});
					}}
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
						id="email"
						label="Email"
						name="email"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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
						onChange={(e) => {
							setPassword(e.target.value);
							setPWChanges(true);
						}}
						autoComplete="current-password"
					/>
					<Select
						fullWidth
						color="primary"
						sx={{
							marginTop: 2,
							marginBottom: 2,
						}}
						onChange={(e) => {
							setRole(e.target.value);
						}}
						value={role}
					>
						<MenuItem value="user">Benutzer</MenuItem>
						<MenuItem value="editor">Editor</MenuItem>
						<MenuItem value="gamemaster">Spielleiter</MenuItem>
						<MenuItem value="admin">Admin</MenuItem>
					</Select>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						sx={{
							marginBottom: 1,
						}}
					>
						{u ? "Speichern" : "Erstellen"}
					</Button>
					<Button
						fullWidth
						variant="outlined"
						color="primary"
						sx={{
							marginBottom: 1,
						}}
						onClick={() => {
							cancel();
						}}
					>
						Abbrechen
					</Button>
					<Typography
						component="h6"
						variant="h6"
						sx={{ textAlign: "center" }}
						color={"error"}
					></Typography>
				</form>
			</DnDEditPaper>
		</div>
	);
}
