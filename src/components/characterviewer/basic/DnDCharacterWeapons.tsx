import { IconButton, Tooltip, Typography } from "@mui/material";
import DnDGameTextBox from "../DnDGameTextBox";
import DnDWaponViewer from "../DnDWeaponViewer";
import { Add, Cancel } from "@mui/icons-material";
import DnDItemBar from "../DnDItemBar";
import { savePlayer } from "@/utils/game";
import {
	getFieldData,
	performItemCommands,
	resolveToValue,
	resolveToValueWithOverride,
	updateField,
} from "@/utils/dataHelper";
import { DnDBasicSheetWidgetContainer } from "../DnDCharacterSheetCP";

export default function DnDCharacterWeapons({
	player,
	character,
	openPopup,
	items,
	gameId,
	updateTick,
}: {
	player: any;
	character: any;
	items: any[];
	gameId: any;
	updateTick: () => void;
	openPopup: (id: string, openAttributes: any) => void;
}) {
	/**
	 *
	 * @param maxInt Max int
	 * @returns A Array of the given Length
	 */
	const generateNumberArray = (maxInt: number) => {
		let ar = [];
		for (let i = 0; i < maxInt; i++) {
			ar.push(i);
		}
		return ar;
	};
	return (
		<DnDBasicSheetWidgetContainer>
			Waffen{" "}
			<Tooltip title="Hinzufügen">
				<IconButton
					onClick={() => {
						openPopup("basic_weapon_edit", { index: "-1" });
					}}
				>
					<Add />
				</IconButton>
			</Tooltip>
			<div style={{ display: "flex", flexDirection: "column" }}>
				{!player.transformData ? (
					player.weapons ? (
						player.weapons.map((item: any, index: number) => {
							if (!item) {
								return <></>;
							}
							return (
								<DnDWaponViewer
									attribute={item.attribute}
									attributeValue={
										Number.parseInt(
											resolveToValueWithOverride(
												player,
												character,
												"att:[" + item.attribute + "]"
											)
										) +
										((character.data.items &&
											character.data.items.ub &&
											(character.data.items.ub.includes(item.name) ||
												character.data.items.ub.includes(item.group))) ||
										item.ubung
											? Number.parseInt(
													getFieldData(player, "transformData.ubungsBonus") ??
														getFieldData(player, "override.ubungsBonus") ??
														getFieldData(character, "ubungsBonus") ??
														"0"
												)
											: 0)
									}
									weaponType={item.weaponType}
									description={resolveToValueWithOverride(
										player,
										character,
										item.description
									)}
									damage={resolveToValueWithOverride(
										player,
										character,
										item.damage
									)}
									name={item.name}
									range={item.range}
									key={item.name + "weapon_open"}
									onClick={() => {
										openPopup("basic_weapon_edit", { weapon: item, index });
									}}
								></DnDWaponViewer>
							);
						})
					) : (
						<></>
					)
				) : (
					player.transformData.weapons.map((item: any, index: number) => {
						if (!item) {
							return <></>;
						}
						return (
							<DnDWaponViewer
								attribute={item.attribute}
								attributeValue={
									Math.floor(
										(Number.parseInt(
											character.attributes[
												item.attribute.replace("ä", "a").toLowerCase()
											]
										) -
											10) /
											2
									) +
									(item.ubung
										? Number.parseInt(
												getFieldData(player, "transformData.ubungsBonus") ??
													getFieldData(player, "override.ubungsBonus") ??
													getFieldData(character, "ubungsBonus") ??
													"0"
											)
										: 0)
								}
								weaponType={item.weaponType}
								description={item.description}
								damage={item.damage}
								name={item.name}
								range={item.range}
								key={item.name + "weapon_open"}
								onClick={() => {
									openPopup("basic_weapon_edit", { weapon: item, index });
								}}
							></DnDWaponViewer>
						);
					})
				)}
				{!player.transformData && character.data.actions ? (
					character.data.actions.map((item: any) => {
						return (
							<DnDWaponViewer
								name={item.name}
								description={item.value}
								attribute="import"
								attributeValue={0}
								weaponType=""
								damage=""
								range=""
								key={item.name + "_trait"}
							></DnDWaponViewer>
						);
					})
				) : (
					<></>
				)}
				{player.transformData && player.transformData.actions ? (
					player.transformData.actions.map((item: any) => {
						return (
							<DnDWaponViewer
								name={item.name}
								description={item.value}
								attribute="import"
								attributeValue={0}
								weaponType=""
								damage=""
								range=""
								key={item.name + "_trait"}
							></DnDWaponViewer>
						);
					})
				) : (
					<></>
				)}
			</div>
			Items
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap",
				}}
			>
				{generateNumberArray(
					player && player.items && player.items.length < 30
						? 30
						: Math.ceil(
								((player && player.items && player.items.length
									? player.items.length
									: 0) +
									1) /
									3
							) * 3
				).map((item) => {
					if (!player || !player.items) {
						return <></>;
					}
					if (player.items[item]) {
						let it = player.items[item];
						if (it.id != "custom") {
							if (!items) {
								return (
									<DnDItemBar
										onClick={() => {
											openPopup("basic_item_edit", {
												...it,
												index: item,
												items,
											});
										}}
										amount={it.amount}
										label={it.name}
										key={"Item_" + item}
									></DnDItemBar>
								);
							}
							for (let i of items) {
								if (i.id == it.id) {
									return (
										<DnDItemBar
											onClick={() => {
												openPopup("basic_item_edit", {
													...it,
													index: item,
													parent: i,
													items,
												});
											}}
											amount={it.amount}
											label={i.name}
											key={"Item_" + item}
										></DnDItemBar>
									);
								}
							}
						}
						return (
							<DnDItemBar
								onClick={() => {
									openPopup("basic_item_edit", { ...it, index: item, items });
								}}
								amount={it.amount}
								label={it.name}
								key={"Item_" + item}
							></DnDItemBar>
						);
					}
					return (
						<DnDItemBar
							onClick={() => {
								openPopup("basic_item_edit", { index: item, items });
							}}
							amount=""
							label={""}
							key={"Item_" + item}
						></DnDItemBar>
					);
				})}
			</div>
			<Typography variant="h5">Spezial Slots:</Typography>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr",
					gridTemplateRows: "auto",
				}}
			>
				<div
					style={{
						textAlign: "left",
						marginRight: "5px",
						marginLeft: "5px",
						marginTop: "5px",
					}}
				>
					<Typography variant="h6">Rüstung</Typography>
					<DnDGameTextBox
						text={
							player.equipment && player.equipment.armor
								? player.equipment.armor.name
								: "Keine Rüstung"
						}
						onClick={() => {
							openPopup("basic_equip_item", {
								slot: "armor",
								it: player.items ?? [],
							});
						}}
						backgroundColor={
							!player.equipment ||
							!player.equipment.armor ||
							(character.data.items &&
								character.data.items.ub &&
								(character.data.items.ub.includes(
									player.equipment.armor.name
								) ||
									character.data.items.ub.includes(
										player.equipment.armor.data.group
									))) ||
							player.equipment.armor.ubung
								? ""
								: "red"
						}
					>
						{player.equipment && player.equipment.armor ? (
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
									let newPlayer = player;
									if (player.equipment.armor.data.onUnequip) {
										newPlayer = performItemCommands(
											newPlayer,
											character,
											player.equipment.armor.data.onUnequip
										);
									}
									savePlayer(gameId, {
										...newPlayer,
										equipment: {
											...newPlayer.equipment,
											armor: undefined,
										},
									});
									updateTick();
								}}
							>
								<Cancel></Cancel>
							</IconButton>
						) : (
							<></>
						)}
					</DnDGameTextBox>
				</div>
				<div
					style={{
						textAlign: "left",
						marginRight: "5px",
						marginLeft: "5px",
						marginTop: "5px",
					}}
				>
					<Typography variant="h6">Hand</Typography>
					<DnDGameTextBox
						onClick={(e) => {
							e.stopPropagation();
							openPopup("basic_equip_item", {
								slot: "hand",
								pos: "hand_l",
								it: player.items ?? [],
							});
						}}
						text={
							player.equipment && player.equipment.hand_l
								? player.equipment.hand_l.name
								: "Hand Links"
						}
						backgroundColor={
							!player.equipment ||
							!player.equipment.hand_l ||
							(character.data.items &&
								character.data.items.ub &&
								(character.data.items.ub.includes(
									player.equipment.hand_l.name
								) ||
									character.data.items.ub.includes(
										player.equipment.hand_l.data.group
									))) ||
							player.equipment.hand_l.ubung
								? ""
								: "red"
						}
					>
						{player.equipment && player.equipment.hand_l ? (
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
									let newPlayer = player;
									if (player.equipment.hand_l.data.onUnequip) {
										newPlayer = performItemCommands(
											newPlayer,
											character,
											player.equipment.hand_l.data.onUnequip
										);
									}
									savePlayer(gameId, {
										...newPlayer,
										equipment: {
											...newPlayer.equipment,
											hand_l: undefined,
										},
									});
									updateTick();
								}}
							>
								<Cancel></Cancel>
							</IconButton>
						) : (
							<></>
						)}
					</DnDGameTextBox>
					<DnDGameTextBox
						onClick={() => {
							openPopup("basic_equip_item", {
								slot: "hand",
								pos: "hand_r",
								it: player.items ?? [],
							});
						}}
						text={
							player.equipment && player.equipment.hand_r
								? player.equipment.hand_r.name
								: "Hand rechts"
						}
						backgroundColor={
							!player.equipment ||
							!player.equipment.hand_r ||
							(character.data.items &&
								character.data.items.ub &&
								(character.data.items.ub.includes(
									player.equipment.hand_r.name
								) ||
									character.data.items.ub.includes(
										player.equipment.hand_r.data.group
									))) ||
							player.equipment.hand_r.ubung
								? ""
								: "red"
						}
					>
						{player.equipment && player.equipment.hand_r ? (
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
									let newPlayer = player;
									if (player.equipment.hand_r.data.onUnequip) {
										newPlayer = performItemCommands(
											newPlayer,
											character,
											player.equipment.hand_r.data.onUnequip
										);
									}
									savePlayer(gameId, {
										...newPlayer,
										equipment: {
											...newPlayer.equipment,
											hand_r: undefined,
										},
									});
									updateTick();
								}}
							>
								<Cancel></Cancel>
							</IconButton>
						) : (
							<></>
						)}
					</DnDGameTextBox>
				</div>
			</div>
		</DnDBasicSheetWidgetContainer>
	);
}
