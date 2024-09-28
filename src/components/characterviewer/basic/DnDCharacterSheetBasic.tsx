import styled from "@emotion/styled";
import DnDCharacterSheetWidget from "../DnDCharacterSheetWidget";
import DnDMoneyBar from "./DnDMoneyBar";
import DnDCharacterSheetAttributes from "./DnDCharacterSheetAttributes";
import DnDCharacterSheetBasicDataWidget from "./DnDCharacterSheetBasicDataWidget";
import DnDCharacterWeapons from "./DnDCharacterWeapons";
import { DnDBasicSheetWidgetContainer } from "../DnDCharacterSheetCP";

export default function DnDCharacterSheetBasic({
	setOpenOverride,
	openPopup,
	player,
	character,
	gameId,
	setUpdateTick,
	items,
	constData,
	widgets,
	savePlayer,
}: {
	setOpenOverride: any;
	openPopup: any;
	player: any;
	character: any;
	gameId: any;
	setUpdateTick: any;
	items: any;
	constData: any;
	widgets: any;
	savePlayer: any;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gridGap: "10px",
				margin: "10px",
				gridTemplateRows: "auto",
			}}
			tabIndex={0}
		>
			<DnDCharacterSheetBasicDataWidget
				character={character}
				player={player}
				gameId={gameId}
				openPopup={openPopup}
				setUpdateTick={setUpdateTick}
			></DnDCharacterSheetBasicDataWidget>
			<DnDCharacterSheetAttributes
				character={character}
				player={player}
			></DnDCharacterSheetAttributes>
			<DnDCharacterWeapons
				updateTick={setUpdateTick}
				items={items}
				character={character}
				openPopup={openPopup}
				gameId={gameId}
				player={player}
			></DnDCharacterWeapons>
			{widgets ? (
				widgets.map((item) => {
					if (
						!item ||
						item.disabled ||
						(item.type != "basic" && item.type != "all")
					) {
						return;
					}
					return (
						<DnDBasicSheetWidgetContainer key={item.id + "_widget"}>
							{" "}
							{item.title}
							<DnDCharacterSheetWidget
								savePlayer={async (playerData: any) => {
									console.log(playerData);
									await savePlayer(gameId, playerData);
									setUpdateTick();
								}}
								characterData={character}
								children={item.children}
								constData={constData}
								id={item.id}
								openPopup={openPopup}
								playerData={player}
								style={item.style}
								title={item.title}
							></DnDCharacterSheetWidget>
						</DnDBasicSheetWidgetContainer>
					);
				})
			) : (
				<></>
			)}
			<DnDMoneyBar
				onClick={() => {
					openPopup("basic_money_setter", {});
				}}
				style={{
					gridColumn: "1 / span 3",
					gridRow: "last-line",
				}}
				gm={player.money ? player.money.gm ?? 0 : 0}
				km={player.money ? player.money.km ?? 0 : 0}
				pm={player.money ? player.money.pm ?? 0 : 0}
				sm={player.money ? player.money.sm ?? 0 : 0}
			></DnDMoneyBar>
		</div>
	);
}
