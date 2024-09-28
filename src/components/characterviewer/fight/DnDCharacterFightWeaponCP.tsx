import { Typography } from "@mui/material";
import { useMemo, useState } from "react";
import DnDCharacterFightWaponViewer from "./DnDCharacterFightWeaponViewer";
import { getFieldData, resolveToValueWithOverride } from "@/utils/dataHelper";

function WeaponViewer({
	setSelectedWeapon,
	selectedWeapon,
	player,
	character,
}: {
	setSelectedWeapon: any;
	selectedWeapon: any;
	player: any;
	character: any;
}) {
	const playerWeapons = useMemo(() => {
		let w: any[] = [];
		if (!player || !character) {
			return w;
		}
		if (!player.transformData) {
			if (player.weapons) {
				w = [...w, ...player.weapons];
			}
			if (character.data.actions) {
				w = [...w, ...character.data.actions];
			}
		} else {
			if (player.transformData.weapons) {
				w = [...w, ...player.transformData.weapons];
			}
			if (player.transformData.actions) {
				w = [...w, ...player.transformData.actions];
			}
		}

		return w;
	}, [player, character]);
	return (
		<>
			<div
				style={{
					padding: "5px",
					flexDirection: "column",
					display: "flex",
				}}
			>
				{playerWeapons.map((item, index) => {
					return (
						<div
							key={item.name + "_" + index}
							style={{
								border: "1px solid black",
								marginTop: "5px",
								textAlign: "center",
								marginBottom: "5px",
								borderRadius: "5px",
								cursor: "pointer",
								backgroundColor:
									index == selectedWeapon ? "#DADAF5" : undefined,
							}}
							onClick={(e) => {
								setSelectedWeapon(index);
							}}
						>
							<Typography variant="h5">{item.name}</Typography>
						</div>
					);
				})}
			</div>
			{selectedWeapon > -1 ? (
				<div
					style={{
						border: "1px solid black",
						borderRadius: "5px",
						padding: "5px",
					}}
				>
					<DnDCharacterFightWaponViewer
						attribute={playerWeapons[selectedWeapon].attribute ?? "import"}
						title={playerWeapons[selectedWeapon].name}
						attributeValue={
							parseInt(
								resolveToValueWithOverride(
									player,
									character,
									"att:[" + playerWeapons[selectedWeapon].attribute + "]"
								)
							) +
							(playerWeapons[selectedWeapon].ubung ||
							(character.data.items &&
								character.data.items.ub &&
								(character.data.items.ub.includes(
									playerWeapons[selectedWeapon].name
								) ||
									character.data.items.ub.includes(
										playerWeapons[selectedWeapon].group
									)))
								? Number.parseInt(
										getFieldData(player, "transformData.ubungsBonus") ??
											getFieldData(player, "override.ubungsBonus") ??
											getFieldData(character, "ubungsBonus") ??
											"0"
									)
								: 0)
						}
						weaponType={playerWeapons[selectedWeapon].weaponType}
						description={
							!playerWeapons[selectedWeapon].attribute
								? playerWeapons[selectedWeapon].value
								: resolveToValueWithOverride(
										player,
										character,
										playerWeapons[selectedWeapon].description
									)
						}
						damage={resolveToValueWithOverride(
							player,
							character,
							playerWeapons[selectedWeapon].damage
						)}
						range={playerWeapons[selectedWeapon].range}
					></DnDCharacterFightWaponViewer>
				</div>
			) : (
				<></>
			)}
		</>
	);
}

function ItemViewer({
	setSelectedWeapon,
	selectedWeapon,
	player,
	character,
}: {
	setSelectedWeapon: any;
	selectedWeapon: any;
	player: any;
	character: any;
}) {
	const playerItems = useMemo(() => {
		if (!player || !character) {
			return [];
		}

		return player.items.filter((item) => item && item.type != "weapon");
	}, [player, character]);
	return (
		<>
			<div
				style={{
					padding: "5px",
					flexDirection: "column",
					display: "flex",
					overflowY: "auto",
					overflowX: "hidden",
					whiteSpace: "pre-line",
					wordBreak: "break-word",
					lineBreak: "auto",
				}}
			>
				{playerItems.map((item, index) => {
					return (
						<div
							key={item.name + "_" + index}
							style={{
								border: "1px solid black",
								marginTop: "5px",
								textAlign: "center",
								marginBottom: "5px",
								borderRadius: "5px",
								cursor: "pointer",
								backgroundColor:
									index == selectedWeapon ? "#DADAF5" : undefined,
							}}
							onClick={(e) => {
								setSelectedWeapon(index);
							}}
						>
							<Typography variant="h5">{item.name}</Typography>
						</div>
					);
				})}
			</div>
			{selectedWeapon > -1 && playerItems[selectedWeapon] ? (
				<div
					style={{
						border: "1px solid black",
						borderRadius: "5px",
						padding: "5px",
						overflow: "auto",
						maxHeight: "400px",
					}}
				>
					<Typography sx={{ fontSize: "16pt", textAlign: "center" }}>
						<b>
							{playerItems[selectedWeapon].name} (
							{playerItems[selectedWeapon].amount})
						</b>
					</Typography>
					<Typography
						sx={{
							fontSize: "14pt",
							textAlign: "justify",
							wordBreak: "break-word",
						}}
					>
						{playerItems[selectedWeapon].description}
					</Typography>
				</div>
			) : (
				<></>
			)}
		</>
	);
}

export default function DnDCharacterFightWeaponCP({
	fight,
	player,
	character,
	updateTick,
}: {
	fight: any;
	player: any;
	character: any;
	updateTick: () => void;
}) {
	const [selectedWeapon, setSelectedWeapon] = useState<number>();
	const [selectedItem, setSelectedItem] = useState<number>();
	const [tabId, setTabId] = useState<any>("weapons");

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 2fr",
				height: "50vh",
				gridTemplateRows: "1fr 40px",
			}}
		>
			{tabId == "weapons" ? (
				<WeaponViewer
					character={character}
					player={player}
					selectedWeapon={selectedWeapon}
					setSelectedWeapon={setSelectedWeapon}
				></WeaponViewer>
			) : (
				<ItemViewer
					character={character}
					player={player}
					selectedWeapon={selectedItem}
					setSelectedWeapon={setSelectedItem}
				></ItemViewer>
			)}
			<div
				style={{
					gridColumn: "1 / span 2",
					flexDirection: "row",
					justifyContent: "center",
					display: "flex",
				}}
			>
				<div
					style={{
						border: "1px solid black",
						textAlign: "center",
						borderRadius: "15px",
						minWidth: "150px",
						height: "25px",
						margin: "10px",
						fontSize: "23px",
						padding: "1px",
						cursor: "pointer",
						backgroundColor: tabId == "weapons" ? "#DADAF5" : undefined,
					}}
					onClick={() => {
						setTabId("weapons");
					}}
				>
					Waffen
				</div>
				<div
					style={{
						border: "1px solid black",
						textAlign: "center",
						borderRadius: "15px",
						minWidth: "150px",
						height: "25px",
						margin: "10px",
						fontSize: "23px",
						padding: "1px",
						cursor: "pointer",
						backgroundColor: tabId == "items" ? "#DADAF5" : undefined,
					}}
					onClick={() => {
						setTabId("items");
					}}
				>
					Items
				</div>
			</div>
		</div>
	);
}
