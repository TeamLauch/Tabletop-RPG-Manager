import { Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DnDEditPaper } from "../basic/DnDStyledComponents";

export default function DnDResetPasswordCP({
	handleSave,
	cancel,
	err,
}: {
	handleSave: any;
	cancel: any;
	err: String;
}) {
	const [username, setUsername] = useState("");

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
					Passwort Ändern
				</Typography>
				<form
					noValidate
					style={{
						width: "100%",
						marginTop: 1,
					}}
					onSubmit={() => {
						handleSave(username);
					}}
				>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="username"
						label="Benutzername"
						type="username"
						id="username"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
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
						Abschicken
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
					>
						{err ? err : ""}
					</Typography>
				</form>
			</DnDEditPaper>
		</div>
	);
}
