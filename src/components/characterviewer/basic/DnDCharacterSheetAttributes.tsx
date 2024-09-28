import { ATTRIBUTES, SUBATTRIBUTES } from "@/utils/constants";
import DnDAttributeSquare from "../DnDAttributeSquare";
import DnDSubAttributeDialog from "../DnDSubAttributeDialog";
import { getFieldData } from "@/utils/dataHelper";
import { DnDBasicSheetWidgetContainer } from "../DnDCharacterSheetCP";

export default function DnDCharacterSheetAttributes({
	player,
	character,
}: {
	player: any;
	character: any;
}) {
	const calculateValueOfSubValue = (sub: string, parent: string) => {
		let ub =
			getFieldData(player, "transformData.ubungsBonus") ??
			getFieldData(player, "override.ubungsBonus") ??
			getFieldData(character, "ubungsBonus") ??
			"0";
		let att =
			getFieldData(
				player,
				"transformData.attributes." +
					parent.toLowerCase().replace("ä", "a").substring(0, 3)
			) ??
			getFieldData(
				player,
				"override.attributes." +
					parent.toLowerCase().replace("ä", "a").substring(0, 3)
			) ??
			getFieldData(
				character,
				"attributes." + parent.toLowerCase().replace("ä", "a").substring(0, 3)
			) ??
			"0";
		att = Math.floor((Number.parseInt(att) - 10) / 2) + "";
		let addPlayer =
			getFieldData(player, "subattributes." + sub, true, character) ?? "0";
		let addCharacter =
			getFieldData(character, "data.subattributes." + sub, true, character) ??
			"0";
		let ubAB =
			getFieldData(player, "override.ubungAB", false) ??
			getFieldData(character, "ubungAB", false) ??
			[];
		if (ubAB.includes(sub)) {
			return (
				Number.parseInt(ub) +
				Number.parseInt(att) +
				Number.parseInt(addPlayer) +
				Number.parseInt(addCharacter)
			);
		}
		return (
			Number.parseInt(att) +
			Number.parseInt(addPlayer) +
			Number.parseInt(addCharacter)
		);
	};

	return (
		<DnDBasicSheetWidgetContainer>
			Attribute
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gridTemplateRows: "auto",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						marginLeft: "1%",
						marginRight: "1%",
					}}
				>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<div
							style={{
								zIndex: 2,
								backgroundColor: "#F1F1F1",
								width: "40px",
								height: "40px",
								borderRadius: "20px",
								borderStyle: "solid",
								borderColor: "black",
								borderWidth: "1px",
								textAlign: "center",
								alignContent: "center",
								fontSize: "25px",
							}}
						>
							{getFieldData(player, "transformData.ubungsBonus") ??
								getFieldData(player, "override.ubungsBonus") ??
								getFieldData(character, "ubungsBonus")}
						</div>
						<div
							style={{
								zIndex: 1,
								backgroundColor: "#F1F1F1",
								width: "calc(100% - 20px)",
								marginLeft: "-20px",
								height: "36px",
								marginTop: "2px",
								borderRadius: "5px",
								borderStyle: "solid",
								borderWidth: "1px",
								borderColor: "black",
								fontSize: "20pt",
							}}
						>
							Übungsbonus
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							marginLeft: "10%",
							marginTop: "3%",
						}}
					>
						{ATTRIBUTES.map((item) => {
							return (
								<DnDAttributeSquare
									backgroundColor={
										player.transformData
											? player.transformData.ubungRW.includes(item.name)
												? "#D6FFAD"
												: "#FFFFFF"
											: character.ubungRW.includes(item.name)
												? "#D6FFAD"
												: "#FFFFFF"
									}
									label={item.name}
									value={
										getFieldData(
											player,
											"transformData.attributes." + item.shortName.toLowerCase()
										) ??
										getFieldData(
											player,
											"override.attributes." + item.shortName.toLowerCase()
										) ??
										getFieldData(
											character,
											"attributes." + item.shortName.toLowerCase()
										)
									}
									key={item.name + "sa"}
								></DnDAttributeSquare>
							);
						})}
					</div>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						marginLeft: "1%",
						marginRight: "1%",
					}}
				>
					{SUBATTRIBUTES.map((item) => {
						return (
							<DnDSubAttributeDialog
								key={item.name + "dialog"}
								backgroundColor={
									player.transformData
										? player.transformData.ubungAB.includes(item.name)
											? "#D6FFAD"
											: "#FFFFFF"
										: (player.ubungAB && player.ubungAB.includes(item.name)) ||
											  character.ubungAB.includes(item.name)
											? "#D6FFAD"
											: "#FFFFFF"
								}
								label={
									item.name + "(" + item.attributeName.substring(0, 3) + ")"
								}
								value={calculateValueOfSubValue(item.name, item.attributeName)}
							></DnDSubAttributeDialog>
						);
					})}
				</div>
			</div>
		</DnDBasicSheetWidgetContainer>
	);
}
