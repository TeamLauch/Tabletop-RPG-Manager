import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Paper, Tab, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { DnDEditPaper } from "../basic/DnDStyledComponents";

export default function DnDUserSettings({
	user,
	updateTick,
}: {
	user: any;
	updateTick: () => void;
}) {
	const [tab, setTab] = useState("1");

	const [currentUser, setCurrentUser] = useState(user);

	return (
		<>
			<DnDEditPaper
				sx={{
					display: "flex",
					width: "98%",
					marginLeft: "1%",
					zIndex: 9,
					marginTop: "3%",
					minHeight: "80%",
					flexDirection: "column",
				}}
			>
				<div
					style={{ display: "flex", justifyContent: "center", marginTop: 2 }}
				>
					<Typography component="h1" variant="h3">
						Bearbeite Nutzer
					</Typography>
				</div>
				<TabContext value={tab}>
					<TabList
						onChange={(e, newValue) => {
							setTab(newValue);
						}}
					>
						<Tab value="1" label="Nutzereinstellungen"></Tab>
						<Tab value="2" disabled label="Nutzertoken"></Tab>
						<Tab value="3" disabled label="Benutzeroberfläche"></Tab>
					</TabList>
					<TabPanel value="1">
						<div
							style={{
								display: "flex",
								flexDirection: "column",
							}}
						>
							<TextField
								label="Benutzername"
								value={currentUser.username}
								disabled
								size="small"
								sx={{ maxWidth: "400px", margin: "5px" }}
								onChange={(e) => {}}
							></TextField>
							<TextField
								label="Email"
								value={currentUser.email}
								size="small"
								sx={{ maxWidth: "400px", margin: "5px" }}
								onChange={(e) => {
									setCurrentUser((prev) => ({
										...prev,
										email: e.target.value,
									}));
								}}
							></TextField>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									borderStyle: "solid",
									borderWidth: "1px",
									borderRadius: "10px",
									maxWidth: "410px",
								}}
							>
								<TextField
									label="Altes Passwort"
									value={currentUser.oldPassword}
									type="password"
									size="small"
									sx={{ maxWidth: "400px", margin: "5px" }}
									onChange={(e) => {
										setCurrentUser((prev) => ({
											...prev,
											oldPassword: e.target.value,
										}));
									}}
								></TextField>
								<TextField
									label="Neues Passwort"
									type="password"
									value={currentUser.newPassword}
									size="small"
									sx={{ maxWidth: "400px", margin: "5px" }}
									onChange={(e) => {
										setCurrentUser((prev) => ({
											...prev,
											newPassword: e.target.value,
										}));
									}}
								></TextField>
							</div>
						</div>
					</TabPanel>
				</TabContext>
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						marginTop: 2,
						marginRight: "0.5%",
						marginBottom: "0.5%",
					}}
				>
					<Button
						variant="outlined"
						onClick={() => {
							window.location.href = "/";
						}}
						sx={{ marginRight: 2 }}
					>
						Abbrechen
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={async () => {
							await axios.post("/api/user/editUser", {
								username: currentUser.username,
								password: currentUser.newPassword,
								oldPassword: currentUser.oldPassword,
								email: currentUser.email,
								pwChanged: currentUser.newPassword ? true : false,
								activated: true,
							});
							await updateTick();
						}}
					>
						Speichern
					</Button>
				</div>
			</DnDEditPaper>
		</>
	);
}
