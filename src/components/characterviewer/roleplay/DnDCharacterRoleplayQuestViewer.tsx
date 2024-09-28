import { Typography } from "@mui/material";
import { MouseEventHandler } from "react";

/**
 *
 * @param name Name der Waffe
 * @param attribute Attribut der Waffe
 * @param attributeValue Bonus der Waffe
 * @param range Reichweite
 * @param dice Würfel der Waffe
 * @param damageType Schadensart der Waffe
 * @param description Beschrebung
 * @returns
 */
export default function DnDCharacterRoleplayQuestViewer({
	quest,
}: {
	quest: any;
}) {
	return (
		<div
			style={{
				fontSize: "14pt",
				textAlign: "justify",
				height: "100%",
			}}
		>
			<Typography sx={{ fontSize: "16pt", textAlign: "center" }}>
				<b>
					{quest.name +
						(quest.qtype == "main" ? " (Hauptquest)" : " (Nebenquest)")}
				</b>
			</Typography>
			<Typography
				variant="body1"
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{quest.description}
			</Typography>
			<Typography variant="body1">
				<b>Abgeschlossen: {quest.solved ? "Ja" : "Nein"}</b>
			</Typography>
		</div>
	);
}
