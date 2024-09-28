import { useGameWorld, useQuests, useTimeline } from "@/utils/customHooks";
import { Widget } from "@/utils/types";
import DnDCharacterImage from "../DnDCharacterImage";
import {
	DnDBasicSheetWidgetContainer,
	DnDCharacterSheetBodyText,
	DnDCharacterSheetDescriptionText,
	DnDCharacterSheetTextBox,
} from "../DnDCharacterSheetCP";
import { useCallback, useMemo } from "react";
import DnDCharacterSheetBasicDataWidget from "../basic/DnDCharacterSheetBasicDataWidget";
import DnDCharacterRoleplayQuestViewer from "./DnDCharacterRoleplayQuestViewer";
import DnDCharacterRoleplayQuestCP from "./DnDCharacterRoleplayQuestCP";
import DnDCharacterRoleplayEventCP from "./DnDCharacterRoleplayEventCP";
import DnDGameTextBox from "../DnDGameTextBox";

export default function DnDCharacterRoleplaySheetCP({
	character,
	player,
	gameId,
	openPopup,
	widgets,
	savePlayer,
	constData,
	world,
	worldData,
	tick,
	updateTick,
}: {
	character: any;
	player: any;
	widgets: Widget[];
	savePlayer: (playerData: any) => void;
	constData: any;
	gameId: any;
	world: any;
	worldData: any;
	tick: number;
	openPopup: (id: string, openAttributes: any) => void;
	updateTick: () => void;
}) {
	const events = useTimeline(gameId, tick);
	const quests = useQuests(gameId, tick);

	const timeNumberToTimeString = useCallback((time: number) => {
		let hours = Math.floor(time / 60);
		let minutes = time % 60;
		return (
			(hours < 10 ? "0" : "") +
			hours +
			":" +
			(minutes < 10 ? "0" : "") +
			minutes
		);
	}, []);

	const dateNumberToWorldDate = useCallback(
		(date: number) => {
			if (!worldData) {
				return "1.1.0";
			}
			let daysPerYear = 0;
			for (let m of worldData.month) {
				daysPerYear += parseInt(m.days);
			}
			let year = Math.floor(date / daysPerYear);
			date = date % daysPerYear;

			if (date == 0) {
				return 1 + "." + 1 + "." + year;
			}
			let i = 0;
			let month = 1;
			let day = 1;
			for (let m of worldData.month) {
				i++;
				if (date - parseInt(m.days) > 0) {
					date -= parseInt(m.days);
					continue;
				}
				month = i;
				day = date;
				break;
			}

			return day + "." + month + "." + year;
		},
		[worldData]
	);

	const currentWorldDate = useMemo(() => {
		if (!world || !worldData) {
			return "1.1.0";
		}
		return (
			dateNumberToWorldDate(parseInt(world.currentDate)) +
			"  " +
			timeNumberToTimeString(parseInt(world.currentTime))
		);
	}, [world, worldData]);

	const mainQuest = useMemo(() => {
		if (!quests) {
			return "-";
		}
		for (let q of quests) {
			if (q.qtype == "main" && q.active) {
				return q.name;
			}
		}
		return "-";
	}, [quests]);

	const decodeWeather = (name: string) => {
		switch (name) {
			case "sun":
				return "Sonne";
			case "cloudy":
				return "Bewölkt";
			case "thunder":
				return "Gewitter";
			case "snow":
				return "Schnee";
			default:
				return "";
		}
	};

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 2fr 2fr 2fr 1fr",
				gridAutoRows: "min-content min(1fr, min-content) min(1fr, min-content)",
				gridGap: "10px 20px",
				padding: "10px",
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
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<DnDCharacterSheetDescriptionText>
					Hauptquest
				</DnDCharacterSheetDescriptionText>
				<DnDCharacterSheetBodyText>{mainQuest}</DnDCharacterSheetBodyText>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<DnDCharacterSheetDescriptionText>
					Position
				</DnDCharacterSheetDescriptionText>
				<DnDCharacterSheetBodyText
					style={{
						cursor: "pointer",
					}}
					onClick={() => {
						openPopup("roleplay_show_position", {});
					}}
				>
					{world.locationPlayer}
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
					Datum
				</DnDCharacterSheetDescriptionText>
				<DnDCharacterSheetBodyText>
					{currentWorldDate}
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
					Wetter
				</DnDCharacterSheetDescriptionText>
				<DnDCharacterSheetBodyText>
					{decodeWeather(world.weather)}
				</DnDCharacterSheetBodyText>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					gridColumn: "span 2",
					gridRow: "span 2",
				}}
			>
				<DnDCharacterSheetDescriptionText>
					Quests
				</DnDCharacterSheetDescriptionText>
				<DnDBasicSheetWidgetContainer
					style={{
						height: "45vh",
					}}
				>
					<DnDCharacterRoleplayQuestCP
						quests={quests}
					></DnDCharacterRoleplayQuestCP>
				</DnDBasicSheetWidgetContainer>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<DnDCharacterSheetDescriptionText>
					Sprachen
				</DnDCharacterSheetDescriptionText>
				<DnDBasicSheetWidgetContainer
					style={{
						height: "45vh",
						overflow: "auto",
					}}
				>
					{character.languages ? (
						character.languages.map((item) => {
							return (
								<DnDCharacterSheetTextBox
									key={item}
									style={{ marginTop: "5px" }}
								>
									{item}
								</DnDCharacterSheetTextBox>
							);
						})
					) : (
						<></>
					)}
				</DnDBasicSheetWidgetContainer>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					gridColumn: "span 2",
					gridRow: "span 2",
				}}
			>
				<DnDCharacterSheetDescriptionText>
					Events
				</DnDCharacterSheetDescriptionText>
				<DnDBasicSheetWidgetContainer
					style={{
						height: "45vh",
					}}
				>
					<DnDCharacterRoleplayEventCP
						dateNumberToWorldDate={dateNumberToWorldDate}
						events={events}
						timeNumberToTimeString={timeNumberToTimeString}
					></DnDCharacterRoleplayEventCP>
				</DnDBasicSheetWidgetContainer>
			</div>
		</div>
	);
}
