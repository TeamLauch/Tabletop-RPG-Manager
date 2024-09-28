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
export default function DnDCharacterFightWaponViewer({
	attribute,
	attributeValue,
	title,
	range,
	description,
	weaponType,
	damage,
}: {
	attribute: string;
	attributeValue: number;
	range: string;
	damage: string;
	title: string;
	weaponType: string;
	description: string;
}) {
	if (attribute == "import") {
		console.log(description);
		return (
			<div
				style={{
					fontSize: "14pt",
					textAlign: "justify",
					height: "100%",
				}}
			>
				<Typography sx={{ fontSize: "16pt", textAlign: "center" }}>
					<b>{title}</b>
				</Typography>
				{description}
			</div>
		);
	}

	return (
		<div
			style={{
				fontSize: "14pt",
				textAlign: "justify",
				height: "100%",
			}}
		>
			<Typography sx={{ fontSize: "16pt", textAlign: "center" }}>
				<b>{title}</b>
			</Typography>
			{weaponType == "Nahkampfwaffe"
				? "Nahkampfangriff: "
				: "Fernkampfangriff: "}{" "}
			+{attributeValue} auf Treffer
			<br /> Reichweite: {range}
			<br /> Treffer: {damage}
			{description ? (
				<>
					<br />
					Beschreibung: <br /> {description}{" "}
				</>
			) : (
				<></>
			)}
		</div>
	);
}
