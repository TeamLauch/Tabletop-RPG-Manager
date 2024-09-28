import { useWorld, useWorlds } from "@/utils/customHooks";
import { addGame } from "@/utils/game";
import {
	Button,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import DnDPopUpMenu from "../basic/DnDPopupMenu";
/**
 *
 * @returns A Component for Adding a new Game
 */
export default function DnDAddGameMenu({
	onSave,
	onClose,
}: {
	onSave: () => void;
	onClose: () => void;
}) {
	const [game, setGame] = useState<any>({
		name: "",
		itemData: [],
		mapData: [
			{
				id: "-1",
				name: "Global",
				images: [],
				players: [],
				npcs: [],
				notes: [],
				tokens: [],
				camera: {
					position: {
						x: 0,
						y: 0,
					},
					scale: 1,
				},
				grid: {
					color: "#000000",
					scale: 50,
					type: "square",
				},
			},
		],
		playerData: [],
		status: "open",
		worldData: {},
	});

	const worlds = useWorlds();

	const world = useWorld(game.worldData.id);

	const worldDateToDateNumber = useCallback(
		(date: string) => {
			let split = date.trim().split(".");
			if (!world || split.length < 2) {
				return 0;
			}
			let daysPerYear = 0;
			for (let m of world.month) {
				daysPerYear += parseInt(m.days);
			}
			let d = parseInt(split[2]) * daysPerYear + parseInt(split[0]);
			for (let i = 1; i < parseInt(split[1]); i++) {
				d += parseInt(world.month[i - 1].days);
			}

			return d;
		},
		[world]
	);

	return (
		<DnDPopUpMenu onClose={onClose} title="Spiel hinzufügen">
			<TextField
				label="Name"
				margin="normal"
				fullWidth
				size="small"
				value={game.name}
				onChange={(e) => {
					setGame((p: any) => ({ ...p, name: e.target.value }));
				}}
			></TextField>
			<Select
				value={game.status}
				sx={{ marginBottom: 1 }}
				fullWidth
				size="small"
				onChange={(e) => {
					setGame((p: any) => ({ ...p, status: e.target.value }));
				}}
			>
				<MenuItem value={"closed"}>Geschlossen</MenuItem>
				<MenuItem value="open">Offen</MenuItem>
			</Select>
			<Select
				value={game.worldData.id ?? "none"}
				sx={{ marginBottom: 1 }}
				fullWidth
				size="small"
				onChange={(e) => {
					setGame((p: any) => ({
						...p,
						worldData: {
							...p.worldData,
							id: e.target.value,
							currentDate: p.currentDate ?? "0.0.0",
							currentTime: "0",
						},
					}));
				}}
			>
				<MenuItem disabled value="none">
					Welt
				</MenuItem>
				{worlds.map((item) => {
					return (
						<MenuItem key={item.id} value={item.id}>
							{item.name}
						</MenuItem>
					);
				})}
			</Select>
			{game.worldData.id ? (
				<>
					<TextField
						label="Spieldatum"
						margin="normal"
						fullWidth
						size="small"
						value={game.worldData.currentDate}
						onChange={(e) => {
							setGame((p: any) => ({
								...p,
								worldData: {
									...p.worldData,
									currentDate: e.target.value,
								},
							}));
						}}
					></TextField>
				</>
			) : (
				<></>
			)}
			<Button
				fullWidth
				variant="contained"
				onClick={async () => {
					await addGame({
						...game,
						worldData: {
							...game.worldData,
							currentDate:
								worldDateToDateNumber(game.worldData.currentDate) + "",
						},
					});
					onSave();
				}}
			>
				Speichern
			</Button>
		</DnDPopUpMenu>
	);
}
