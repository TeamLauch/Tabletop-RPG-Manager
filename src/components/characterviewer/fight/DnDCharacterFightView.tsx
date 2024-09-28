import { useFight } from "@/utils/customHooks";
import DnDHorizontalBar from "../DnDHorizontalBar";
import { getFieldData } from "@/utils/dataHelper";
import { IconButton, styled, Typography } from "@mui/material";
import DnDCharacterFightStats from "./DnDCharacterFightStats";
import DnDRescueDeadCounter from "../DnDRescueDeathCounter";
import DnDAttributeSquare from "../DnDAttributeSquare";
import { ATTRIBUTES } from "@/utils/constants";
import { useMemo, useState } from "react";
import { Widget } from "@/utils/types";
import DnDCharacterFightWeaponCP from "./DnDCharacterFightWeaponCP";
import DnDCharacterFightAbilityView from "./DnDCharacterFightAbilityView";
import DnDCharacterSheetWidget from "../DnDCharacterSheetWidget";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import {
	DnDBasicSheetWidgetContainer,
	DnDCharacterSheetBodyText,
	DnDCharacterSheetDescriptionText,
} from "../DnDCharacterSheetCP";

export default function DnDCharacterFightView({
	character,
	player,
	gameId,
	openPopup,
	widgets,
	savePlayer,
	constData,
	tick,
	updateTick,
}: {
	character: any;
	player: any;
	widgets: Widget[];
	savePlayer: (playerData: any) => void;
	constData: any;
	gameId: any;
	tick: number;
	openPopup: (id: string, openAttributes: any) => void;
	updateTick: () => void;
}) {
	const fight = useFight(gameId, player.id, tick);
	const [currentWidget, steCurrentWidget] = useState(0);

	const convertTime = (time: number) => {
		let min = Math.floor(time / 60);
		let sec = time % 60;

		return (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
	};

	const filteredWidgets = useMemo(() => {
		return widgets.filter(
			(item) =>
				(item.type == "fight" || item.type == "all") && item.id != "abilities"
		);
	}, [widgets]);

	const abilitiesWidget = useMemo(() => {
		for (let w of widgets) {
			if (w.id == "abilities") {
				return w;
			}
		}
		return undefined;
	}, [widgets]);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(6, 1fr)",
				gridAutoRows: "min-content min(1fr, min-content) min(1fr, min-content)",
				gridGap: "10px 20px",
				padding: "10px",
			}}
		>
			<div
				style={{
					gridColumn: "span 2",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						marginLeft: "1%",
						marginRight: "1%",
					}}
				>
					<DnDCharacterSheetDescriptionText>
						Trefferpunkte
					</DnDCharacterSheetDescriptionText>
					<DnDCharacterSheetDescriptionText>
						{player.hp}/
						{getFieldData(player, "transformData.hp") ??
							getFieldData(player, "override.hp") ??
							getFieldData(character, "hp")}
					</DnDCharacterSheetDescriptionText>
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
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<DnDCharacterSheetDescriptionText>
					Aktueller Spieler
				</DnDCharacterSheetDescriptionText>
				<DnDCharacterSheetBodyText>
					{fight ? fight.currentPerson : "-"}
				</DnDCharacterSheetBodyText>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<DnDCharacterSheetDescriptionText>
					Nächster Spieler
				</DnDCharacterSheetDescriptionText>
				<DnDCharacterSheetBodyText>
					{fight ? fight.nextPerson : "-"}
				</DnDCharacterSheetBodyText>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gridGap: "5px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
					}}
				>
					<DnDCharacterSheetDescriptionText>
						Initiative
					</DnDCharacterSheetDescriptionText>
					<DnDCharacterSheetBodyText>
						{fight ? fight.ownInit : "-"}
					</DnDCharacterSheetBodyText>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
					}}
				>
					<DnDCharacterSheetDescriptionText>
						Runde
					</DnDCharacterSheetDescriptionText>
					<DnDCharacterSheetBodyText>
						{fight ? fight.round : "-"}
					</DnDCharacterSheetBodyText>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<DnDCharacterSheetDescriptionText>
					Zeit
				</DnDCharacterSheetDescriptionText>
				<DnDCharacterSheetBodyText style={{ width: "100%" }}>
					{fight ? convertTime(fight.time) : "-"}
				</DnDCharacterSheetBodyText>
			</div>
			<DnDCharacterFightStats
				fight={fight}
				style={{ gridRow: "span 2" }}
			></DnDCharacterFightStats>
			<DnDBasicSheetWidgetContainer>
				<div
					style={{
						marginTop: "10px",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						padding: "5px",
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
					<div style={{ width: "50%", textAlign: "left" }}>Land</div>
					<div>
						{getFieldData(player, "transformData.bewegungsrate.land") ??
							getFieldData(player, "override.data.bewegungsrate.land") ??
							getFieldData(character, "data.bewegungsrate.land") ??
							"0"}
						m
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
					<div style={{ width: "50%", textAlign: "left" }}>Wasser</div>
					<div>
						{getFieldData(player, "transformData.bewegungsrate.wasser") ??
							getFieldData(player, "override.data.bewegungsrate.wasser") ??
							getFieldData(character, "data.bewegungsrate.wasser") ??
							"0"}
						m
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
					<div style={{ width: "50%", textAlign: "left" }}>Luft</div>
					<div>
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
				<DnDRescueDeadCounter
					deads={player.rescueW ? player.rescueW.deads ?? 0 : 0}
					saves={player.rescueW ? player.rescueW.saves ?? 0 : 0}
					onClick={async (saves, deads) => {
						await savePlayer({
							...player,
							rescueW: {
								deads: deads,
								saves: saves,
							},
						});
						updateTick();
					}}
				></DnDRescueDeadCounter>
			</DnDBasicSheetWidgetContainer>
			<DnDBasicSheetWidgetContainer
				style={{
					gridRow: "span 2",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
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
								textAlign: "left",
								borderStyle: "solid",
								borderWidth: "1px",
								borderColor: "black",
								fontSize: "20pt",
							}}
						>
							<div style={{ marginLeft: "20px", textAlign: "center" }}>
								Übungsbonus
							</div>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							marginLeft: "5px",
							gridRow: "span 2",
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
			</DnDBasicSheetWidgetContainer>
			<DnDBasicSheetWidgetContainer style={{ gridColumn: "span 3" }}>
				<DnDCharacterFightWeaponCP
					character={character}
					fight={fight}
					player={player}
					updateTick={updateTick}
				></DnDCharacterFightWeaponCP>
			</DnDBasicSheetWidgetContainer>

			<DnDBasicSheetWidgetContainer style={{ overflow: "auto" }}>
				{abilitiesWidget ? (
					<DnDCharacterSheetWidget
						characterData={character}
						children={abilitiesWidget.children}
						constData={constData}
						id={abilitiesWidget.id}
						openPopup={openPopup}
						playerData={player}
						savePlayer={savePlayer}
						style={abilitiesWidget.style}
						title={abilitiesWidget.title}
					></DnDCharacterSheetWidget>
				) : (
					<></>
				)}
			</DnDBasicSheetWidgetContainer>

			{filteredWidgets.length > 0 ? (
				<DnDBasicSheetWidgetContainer style={{ gridColumn: "span 3" }}>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							marginLeft: "10px",
							marginRight: "10px",
						}}
					>
						<IconButton
							disabled={currentWidget == 0}
							onClick={() => {
								steCurrentWidget(currentWidget - 1);
							}}
						>
							{" "}
							<ArrowLeft></ArrowLeft>
						</IconButton>
						<Typography variant="h5" sx={{ textAlign: "center" }}>
							{filteredWidgets[currentWidget].title ?? ""}
						</Typography>
						<IconButton
							disabled={currentWidget == filteredWidgets.length - 1}
							onClick={() => {
								steCurrentWidget(currentWidget + 1);
							}}
						>
							{" "}
							<ArrowRight></ArrowRight>
						</IconButton>
					</div>
					{filteredWidgets.map((item, index) => {
						if (index != currentWidget) {
							return <></>;
						}
						return (
							<DnDCharacterSheetWidget
								key={item.id + "fight_widgte"}
								savePlayer={savePlayer}
								characterData={character}
								children={item.children}
								constData={constData}
								id={item.id}
								openPopup={openPopup}
								playerData={player}
								style={item.style}
								title={item.title}
							></DnDCharacterSheetWidget>
						);
					})}
				</DnDBasicSheetWidgetContainer>
			) : (
				<></>
			)}
		</div>
	);
}
