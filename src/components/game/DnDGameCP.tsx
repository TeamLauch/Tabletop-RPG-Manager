import { createGame } from "@/utils/game";
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useGames, useTick, useUsernames } from "@/utils/customHooks";
import DnDGameItem from "./DnDGameItem";
import DnDPopUpMenu from "../basic/DnDPopupMenu";
import DnDModal from "../basic/DnDModal";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import axios from "axios";
import DnDAddGameMenu from "./DnDAddGameMenu";

/**
 *
 * @param w Margin Left
 * @param username Username
 * @returns A list of all Games
 */
export function DnDGameCP({
	username,
	isAdmin,
}: {
	username: any;
	isAdmin: boolean;
}) {
	const { tick, updateTick } = useTick();
	const games = useGames(tick);

	const [open, setOpen] = useState(false);

	const [selectedGame, setSelectedGame] = useState("-1");
	const [selected, setSelected] = useState<string | undefined>(undefined);
	const usernames = useUsernames();

	const handleTransfere = async (id: any, username: any) => {
		const res = await axios.post("/api/game/transfereGame", {
			id: id,
			newOwner: username,
		});
		if (res.status == 200) {
			window.location.href = "/games";
		} else {
			console.log("error while transfering Game");
		}
	};

	const handleOpen = (id: any) => {
		setOpen(true);
		setSelectedGame(id);
	};

	const [newGameMenu, openNewGameMenu] = useState(false);

	return (
		<>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyItems: "right",
						justifyContent: "right",
					}}
				>
					<Button
						variant="contained"
						onClick={() => {
							openNewGameMenu(true);
						}}
					>
						Game Hinzufügen
					</Button>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
					}}
				>
					{games.map((item) => {
						return (
							<DnDGameItem
								game={item}
								username={username}
								key={item.id}
								onOpen={() => handleOpen(item.id)}
								isAdmin={isAdmin}
							></DnDGameItem>
						);
					})}
				</div>
				<DnDModal
					open={open}
					onClose={() => setOpen(false)}
					commitLable={"Spiel Transferieren"}
					children={
						<div>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									marginTop: "1em",
								}}
							>
								<Typography variant="h3">Spiel Transferieren</Typography>
							</div>
							<div>
								<FormControl fullWidth>
									<InputLabel id="UserSelect">Benutzer wählen</InputLabel>
									<Select
										labelId="UserSelect"
										id="UserSelect"
										value={selected}
										label="Benutzer wählen"
										onChange={(e) => setSelected(e.target.value)}
									>
										{usernames.map((item: User) => (
											<MenuItem key={item.username} value={item.username}>
												{item.username}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>
						</div>
					}
					onCommit={() => handleTransfere(selectedGame, selected)}
				></DnDModal>
			</div>
			{newGameMenu ? (
				<DnDAddGameMenu
					onClose={() => {
						openNewGameMenu(false);
					}}
					onSave={() => {
						updateTick();
					}}
				></DnDAddGameMenu>
			) : (
				<></>
			)}
		</>
	);
}
