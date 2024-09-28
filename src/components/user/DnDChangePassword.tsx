import { Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DnDEditPaper } from "../basic/DnDStyledComponents";

/**
 *
 * @param handleSave Handles Save
 * @param cancel Handles Cancel
 * @returns A Component for Changing Password
 */
export default function DnDChangePassword({
	handleSave,
	cancel,
	err,
	oldPW,
}: {
	oldPW: boolean;
	handleSave: any;
	cancel: any;
	err: String;
}) {
	const [oldPassword, setOldPassword] = useState("");
	const [password, setPassword] = useState("");
	const [checked, setChecked] = useState(false);

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
						handleSave(password, oldPassword);
					}}
				>
					{oldPW ? (
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="oldPW"
							label="Altes Passwort"
							type="password"
							id="oldPW"
							value={oldPassword}
							onChange={(e) => {
								setOldPassword(e.target.value);
							}}
							autoComplete="current-password"
						/>
					) : (
						<></>
					)}
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Neues Passwort"
						type="password"
						id="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						autoComplete="current-password"
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Wiederholen"
						type="password"
						id="password"
						onChange={(e) => {
							if (e.target.value == password) {
								setChecked(true);
							} else {
								setChecked(false);
							}
						}}
						autoComplete="current-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						disabled={!checked}
						sx={{
							marginBottom: 1,
						}}
					>
						Speichern
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
