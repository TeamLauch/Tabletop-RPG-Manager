import {
	IconButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Tooltip,
} from "@mui/material";
import { saveGame } from "@/utils/game";
import { Add, Delete, VisibilityOff } from "@mui/icons-material";
import DnDGamemasterDefaulListCP from "./DnDGamemasterDefaultListCP";
import DnDContextMenu from "../basic/DnDContextMenu";
import { useState } from "react";
/**
 * A List of all Items in the Game
 *
 * @param updateTick Updates all Data from Database
 * @param game Game Data
 * @param setPopupData Updates Data for Popup
 * @param setPopupId Chooses Current Popup to Show
 */
export default function DnDGamemasterItemsListCP({
	game,
	setPopupData,
	setPopupId,
	updateTick,
	customContext,
	setCustomContext,
}: {
	game: any;
	setPopupData: any;
	setPopupId: any;
	updateTick: any;
	setCustomContext: any;
	customContext: any;
}) {
	const [selectedItems, setSelectedItems] = useState<string[]>([]);

	const getItemById = (ids: any[]) => {
		let p = [];
		for (let p1 of game.itemData) {
			if (!p1) {
				continue;
			}
			if (ids.includes(p1.id)) {
				p.push(p1);
			}
		}
		return p;
	};

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gap: "10px",
				gridRow: "auto",
			}}
			onClick={(e) => {
				if (!e.ctrlKey) {
					setSelectedItems([]);
				}
			}}
		>
			{customContext ? (
				<DnDContextMenu posX={customContext.posX} posY={customContext.posY}>
					<MenuItem
						disabled={selectedItems.length == 0 && !customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							if (selectedItems && selectedItems.length > 0) {
								let itemData = game.itemData.filter(
									(value) => !value || !selectedItems.includes(value.id)
								);
								await saveGame({
									...game,
									itemData: itemData,
								});
								setSelectedItems([]);
								updateTick();
								setCustomContext(undefined);
								return;
							}
							if (customContext.target) {
								let itemData = game.itemData.filter(
									(value) => !value || value.id != customContext.target
								);
								await saveGame({
									...game,
									itemData: itemData,
								});
								updateTick();
							}
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Delete></Delete>
						</ListItemIcon>
						<ListItemText>Item Löschen</ListItemText>
					</MenuItem>
					<MenuItem
						onClick={async (e) => {
							e.stopPropagation();
							setPopupData({});
							setPopupId(5);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Add></Add>
						</ListItemIcon>
						<ListItemText>Item hinzufügen</ListItemText>
					</MenuItem>
				</DnDContextMenu>
			) : (
				<></>
			)}
			{game.itemData ? (
				game.itemData.map((item: any, index: number) => {
					if (!item) {
						return <></>;
					}
					return (
						<div
							key={item.id + "view"}
							onContextMenu={
								setCustomContext
									? (e) => {
											e.preventDefault();
											setCustomContext({
												posX: e.pageX,
												posY: e.pageY,
												target: item.id,
											});
											e.stopPropagation();
										}
									: undefined
							}
							onClick={(e) => {
								if (e.ctrlKey) {
									if (selectedItems.includes(item.id)) {
										setSelectedItems(
											selectedItems.filter((value) => value != item.id)
										);
									} else {
										setSelectedItems((prev) => [...prev, item.id]);
									}
									return;
								}
								setPopupData(item);
								setPopupId(6);
							}}
							style={{
								cursor: "pointer",
								border: "1px solid black",
								boxShadow: "2px 2px rgba(0,0,0,0.25)",
								display: "flex",
								flexDirection: "column",
								textAlign: "left",
								width: "90%",
								marginLeft: "5%",
								marginBottom: "5px",
								marginTop: "5px",
								borderRadius: "10px",
								backgroundColor: selectedItems.includes(item.id)
									? "#DADAFA"
									: undefined,
							}}
						>
							<div style={{ textAlign: "center", fontSize: "20pt" }}>
								<b>{item.name}</b>
							</div>
							<div>
								Typ:{" "}
								{item.type == "item"
									? "Item"
									: item.type == "weapon"
										? "Waffe"
										: "Sonstiges"}
							</div>
						</div>
					);
				})
			) : (
				<></>
			)}
		</div>
	);
}
