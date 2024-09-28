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
export default function DnDWaponViewer({
	name,
	attribute,
	attributeValue,
	range,
	description,
	weaponType,
	damage,
	onClick,
}: {
	onClick?: MouseEventHandler<HTMLDivElement>;
	name: string;
	attribute: string;
	attributeValue: number;
	range: string;
	damage: string;
	weaponType: string;
	description: string;
}) {
	if (attribute == "import") {
		return (
			<div
				onClick={onClick}
				style={{
					cursor: onClick ? "pointer" : "default",
					marginLeft: "1%",
					width: "98%",
					minHeight: "64px",
					display: "flex",
					flexDirection: "column",
					marginBottom: "10px",
				}}
			>
				<div
					style={{
						width: "100%",
						minHeight: "30px",
						display: "flex",
						flexDirection: "row",
						marginBottom: "4px",
					}}
				>
					<div
						style={{
							width: "100%",
							minHeight: "30px",
							borderRadius: "5px",
							borderStyle: "solid",
							borderWidth: "1px",
							marginRight: "4px",
							alignContent: "center",
							fontSize: "20px",
							textAlign: "left",
						}}
					>
						{name}
					</div>
				</div>
				<div
					style={{
						width: "99%",
						minHeight: "30px",
						alignContent: "center",
						fontSize: "20px",
						borderStyle: "solid",
						borderRadius: "5px",
						borderWidth: "1px",
						borderColor: "black",
						textAlign: "justify",
					}}
				>
					{description}
				</div>
			</div>
		);
	}

	return (
		<div
			onClick={onClick}
			style={{
				cursor: onClick ? "pointer" : "default",
				marginLeft: "1%",
				width: "98%",
				minHeight: "64px",
				display: "flex",
				flexDirection: "column",
				marginBottom: "10px",
			}}
		>
			<div
				style={{
					width: "100%",
					minHeight: "30px",
					display: "flex",
					flexDirection: "row",
					marginBottom: "4px",
				}}
			>
				<div
					style={{
						width: "100%",
						minHeight: "30px",
						borderRadius: "5px",
						borderStyle: "solid",
						borderWidth: "1px",
						marginRight: "4px",
						alignContent: "center",
						fontSize: "20px",
						textAlign: "left",
					}}
				>
					{name}
				</div>
			</div>
			<div
				style={{
					width: "99%",
					minHeight: "30px",
					alignContent: "center",
					fontSize: "20px",
					borderStyle: "solid",
					borderRadius: "5px",
					borderWidth: "1px",
					borderColor: "black",
					textAlign: "justify",
				}}
			>
				{weaponType == "Nahkampfwaffe"
					? "Nahkampfangriff: "
					: "Fernkampfangriff: "}{" "}
				+{attributeValue} auf Treffer, Reichweite: {range}, Treffer: {damage}{" "}
				{description ? (
					<>
						<br />
						Beschreibung: <br /> {description}{" "}
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
