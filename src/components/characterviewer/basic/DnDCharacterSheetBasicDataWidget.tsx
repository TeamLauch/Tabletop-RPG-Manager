import { savePlayer } from "@/utils/game";
import DnDHorizontalBar from "../DnDHorizontalBar";
import DnDRescueDeadCounter from "../DnDRescueDeathCounter";
import DnDCharacterImage from "../DnDCharacterImage";
import { getFieldData } from "@/utils/dataHelper";
import { DnDBasicSheetWidgetContainer } from "../DnDCharacterSheetCP";

export default function DnDCharacterSheetBasicDataWidget({
	player,
	character,
	openPopup,
	gameId,
	setUpdateTick,
}: {
	player: any;
	character: any;
	openPopup: (id: string, openAttributes: any) => void;
	gameId: string;
	setUpdateTick: any;
}) {
	return (
		<DnDBasicSheetWidgetContainer
			style={{
				minWidth: "300px",
			}}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 2fr",
					gridTemplateRows: "auto",
					marginBottom: "10px",
				}}
			>
				<DnDCharacterImage
					src={
						"/api/file/getImage?type=" +
						(player.parent ? "npc" : "character") +
						"&id=" +
						character.id
					}
				></DnDCharacterImage>
				<div>
					Basis{" "}
					{getFieldData(character, "data.level")
						? "(Level " + getFieldData(character, "data.level") + ")"
						: ""}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							fontSize: "18pt",
							marginLeft: "1%",
							marginRight: "1%",
						}}
					>
						<div
							style={{
								marginTop: "10px",
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								fontSize: "18pt",
								marginLeft: "1%",
								marginRight: "1%",
							}}
						>
							<div>Rüstungsklasse</div>
							<div>
								{getFieldData(player, "transformData.rk") ??
									getFieldData(player, "rk") ??
									getFieldData(player, "override.rk") ??
									getFieldData(character, "rk") ??
									"0"}
							</div>
						</div>
						<div
							style={{
								marginTop: "10px",
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								fontSize: "18pt",
								marginLeft: "1%",
								marginRight: "1%",
							}}
						>
							<div style={{ width: "50%", textAlign: "left" }}>
								Bewegungsrate (Land|Was|Flu)
							</div>
							<div>
								{getFieldData(player, "transformData.bewegungsrate.land") ??
									getFieldData(player, "override.data.bewegungsrate.land") ??
									getFieldData(character, "data.bewegungsrate.land") ??
									"0"}
								m |{" "}
								{getFieldData(player, "transformData.bewegungsrate.wasser") ??
									getFieldData(player, "override.data.bewegungsrate.wasser") ??
									getFieldData(character, "data.bewegungsrate.wasser") ??
									"0"}
								m |{" "}
								{getFieldData(player, "transformData.bewegungsrate.luft") ??
									getFieldData(player, "override.data.bewegungsrate.luft") ??
									getFieldData(character, "data.bewegungsrate.luft") ??
									"0"}
								m
							</div>
						</div>
						{getFieldData(character, "data.dice.default") ||
						getFieldData(player, "override.data.dice.default") ? (
							<div
								style={{
									marginTop: "10px",
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									fontSize: "18pt",
									marginLeft: "1%",
									marginRight: "1%",
								}}
							>
								<div>Trefferwürfel</div>
								<div>
									{getFieldData(player, "diceAmount")} +{" "}
									{getFieldData(player, "override.data.dice.default") ??
										getFieldData(character, "data.dice.default")}
								</div>
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					fontSize: "18pt",
					marginLeft: "1%",
					marginRight: "1%",
				}}
			>
				<div>Trefferpunkte</div>
				<div>
					{player.hp}/
					{getFieldData(player, "transformData.hp") ??
						getFieldData(player, "override.hp") ??
						getFieldData(character, "hp")}
				</div>
			</div>
			<DnDHorizontalBar
				onClick={() => {
					openPopup("basic_edit_hp", {});
				}}
				colorOne="#A7F3AA"
				colorTwo="#F67070"
				currentValue={player.hp}
				maxValue={
					getFieldData(player, "transformData.hp") ??
					getFieldData(player, "override.hp") ??
					getFieldData(character, "hp")
				}
			></DnDHorizontalBar>
			<DnDRescueDeadCounter
				deads={player.rescueW ? player.rescueW.deads ?? 0 : 0}
				saves={player.rescueW ? player.rescueW.saves ?? 0 : 0}
				onClick={async (saves, deads) => {
					await savePlayer(gameId, {
						...player,
						rescueW: {
							deads: deads,
							saves: saves,
						},
					});
					setUpdateTick();
				}}
			></DnDRescueDeadCounter>
		</DnDBasicSheetWidgetContainer>
	);
}
