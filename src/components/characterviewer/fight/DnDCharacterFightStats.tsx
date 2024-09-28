import { Typography } from "@mui/material";
import { CSSProperties } from "react";
import { DnDBasicSheetWidgetContainer } from "../DnDCharacterSheetCP";

export default function DnDCharacterFightStats({
	fight,
	style = {},
}: {
	fight: any;
	style?: CSSProperties;
}) {
	if (!fight || !fight.damageDone) {
		return (
			<DnDBasicSheetWidgetContainer
				style={{
					textAlign: "center",
					fontSize: "14pt",
					...style,
				}}
			>
				Kein Kampf aktiv
			</DnDBasicSheetWidgetContainer>
		);
	}

	return (
		<DnDBasicSheetWidgetContainer
			style={{
				...style,
			}}
		>
			<Typography
				variant="h4"
				sx={{
					textAlign: "center",
				}}
			>
				<b>Gegner</b>
			</Typography>
			{fight.damageDone.map((item) => {
				return (
					<div
						key={item.id + "_dam"}
						style={{
							display: "flex",
							flexDirection: "column",
							marginTop: "5px",
							marginBottom: "5px",
						}}
					>
						<Typography
							variant="h5"
							sx={{
								textAlign: "center",
							}}
						>
							<b>{item.name}</b>
						</Typography>
						<Typography variant="body1">
							<b>-{item.damage}</b> Trefferpunkte{" "}
						</Typography>
					</div>
				);
			})}
		</DnDBasicSheetWidgetContainer>
	);
}
