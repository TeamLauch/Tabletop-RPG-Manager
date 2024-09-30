import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import SetupCP from "@/components/setup/SetupCP";
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
	const [error, setError] = useState("");
	const [setup, setSetuped] = useState(false);
	const [ready, setReady] = useState(false);

	/**
	 * Checks whether it is setup or not
	 */
	useEffect(() => {
		const load = async () => {
			const res = await axios.get("/api/setup/setup");
			setSetuped(!res.data.toSetup);
			setReady(true);
		};
		load();
	}, [router]);

	if (!ready) {
		return (
			<div
				style={{
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

	return (
		<DnDDefaultPage
			error={error}
			navBar={false}
			setError={setError}
			user={undefined}
		>
			<SetupCP></SetupCP>
		</DnDDefaultPage>
	);
}

export default Setup;
