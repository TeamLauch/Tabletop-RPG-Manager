import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDUserSettings from "@/components/user/DnDUserSettings";
import { useLoginData, useTick, useUser } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";

export default function UserSettingsSite() {
	const { loggedIn, ready, user } = useLoginData("user");
	const [error, setError] = useState("");
	const { tick, updateTick } = useTick();
	const u = useUser(tick);

	if (!ready || !u) {
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
			children={
				<DnDUserSettings user={u} updateTick={updateTick}></DnDUserSettings>
			}
		/>
	);
}
