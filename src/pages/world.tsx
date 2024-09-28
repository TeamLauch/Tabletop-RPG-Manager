import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDWorldCP from "@/components/world/DnDWorldCP";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";

export default function WorldSite() {
	const { loggedIn, ready, user } = useLoginData("gamemaster");
	const [error, setError] = useState("");

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
		window.location.href = "/";
		return <></>;
	}

	return (
		<DnDDefaultPage
			error={error}
			setError={setError}
			user={user}
			navBar
			children={<DnDWorldCP></DnDWorldCP>}
		/>
	);
}
