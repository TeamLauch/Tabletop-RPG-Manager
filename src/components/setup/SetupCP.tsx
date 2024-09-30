import {
	Button,
	MenuItem,
	Paper,
	Select,
	Step,
	StepLabel,
	Stepper,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

export type SetupData = {
	username: string;
	password: string;
	ruleset: {
		url: string;
		name: string;
		type: "dnd5e";
	};
};

const steps = ["Admin Account", "Regelsystem", "Setup"];

export default function SetupCP() {
	const [data, setData] = useState<SetupData>();
	const [activeStep, setActiveStep] = useState(0);

	const startSetup = async () => {
		await axios.post("/api/setup/setup", data);
		window.location.reload();
	};

	return (
		<div
			style={{
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
					minWidth: "30%",
				}}
			>
				<Typography variant="h3" sx={{ marginBottom: "5px" }}>
					Setup
				</Typography>
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => {
						const stepProps: { completed?: boolean } = {};
						const labelProps: {
							optional?: React.ReactNode;
						} = {};
						return (
							<Step key={label} {...stepProps}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				<div
					style={{
						width: "100%",
						padding: "5px",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{activeStep == 0 ? (
						<>
							<TextField
								label="Benutzername"
								size="small"
								value={data ? data.username : ""}
								sx={{ margin: "5px" }}
								onChange={(e) => {
									setData((prev) => ({
										...prev,
										username: e.target.value,
									}));
								}}
							></TextField>
							<TextField
								label="Passowort"
								type="password"
								size="small"
								value={data ? data.password : ""}
								sx={{ margin: "5px" }}
								onChange={(e) => {
									setData((prev) => ({
										...prev,
										password: e.target.value,
									}));
								}}
							></TextField>
						</>
					) : (
						<></>
					)}
					{activeStep == 1 ? (
						<>
							<Select
								label="System"
								size="small"
								sx={{ margin: "5px" }}
								value={
									data && data.ruleset ? (data.ruleset.type ?? "none") : "none"
								}
								onChange={(e) => {
									if (e.target.value != "dnd5e") {
										return;
									}
									if (!data) {
										setData((prev) => ({
											...prev,
											ruleset: {
												url: undefined,
												type: "dnd5e",
												name: "D&D 5e Systemreferenzdokument",
											},
										}));
										return;
									}
									setData((prev) => ({
										...prev,
										ruleset: {
											...prev.ruleset,
											type: "dnd5e",
											name: "D&D 5e Systemreferenzdokument",
										},
									}));
								}}
							>
								<MenuItem value="none" disabled>
									RPG-System
								</MenuItem>
								<MenuItem value="dnd5e">
									SRD 5e (Systemreferenzdokument) D&D
								</MenuItem>
							</Select>
							<TextField
								label="URL (Ruleset.zip)"
								size="small"
								value={data && data.ruleset ? data.ruleset.url : ""}
								sx={{ margin: "5px" }}
								onChange={(e) => {
									if (!data) {
										setData((prev) => ({
											...prev,
											ruleset: {
												url: e.target.value,
												name: undefined,
												type: undefined,
											},
										}));
										return;
									}
									setData((prev) => ({
										...prev,
										ruleset: {
											...prev.ruleset,
											url: e.target.value,
										},
									}));
								}}
							></TextField>
						</>
					) : (
						<></>
					)}
					{activeStep == 2 ? (
						<>
							<Typography variant="body1">
								Die Datenbank wird nun aufgesetzt.
							</Typography>
						</>
					) : (
						<></>
					)}
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "space-evenly",
						width: "100%",
						marginTop: 20,
					}}
				>
					<Button
						onClick={() => {
							setActiveStep(activeStep - 1);
						}}
						disabled={activeStep < 1 || activeStep >= steps.length - 1}
						variant="contained"
						color="primary"
						sx={{
							marginBottom: 1,
							width: "30%",
						}}
					>
						Zurück
					</Button>
					<Button
						variant="outlined"
						color="primary"
						sx={{
							marginBottom: 1,
							width: "30%",
						}}
						disabled={activeStep >= steps.length - 1}
						onClick={() => {
							setActiveStep(activeStep + 1);
							if (activeStep + 2 == steps.length) {
								startSetup();
							}
						}}
					>
						{activeStep < steps.length - 2 ? "Weiter" : "Abschließen"}
					</Button>
				</div>
			</Paper>
		</div>
	);
}
