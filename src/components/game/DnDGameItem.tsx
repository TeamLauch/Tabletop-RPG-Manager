import { Button, Paper, Typography } from "@mui/material";

/**
 *
 * @param game Data of The Game
 * @param username Username of the User
 * @returns A Component for Joining the Game
 */
export default function DnDGameItem({
	game,
	username,
	onOpen,
	isAdmin,
}: {
	game: any;
	username: string;
	onOpen: any;
	isAdmin: boolean;
}) {
	const AccessibleBy = game.gamemasters;
	return (
		<Paper
			elevation={2}
			sx={{
				borderRadius: "5px",
				borderStyle: "solid",
				borderWidth: "1px",
				background: "rgba(255,255,255,.1)",
				backdropFilter: "blur(8px)",
				borderColor: "black",
				textAlign: "center",
				width: "400px",
				marginRight: "20px",
				marginLeft: "20px",
			}}
		>
			<Typography variant="h4">{game.name}</Typography>
			<div
				style={{
					textAlign: "left",
					marginLeft: "5px",
				}}
			>
				Spielleiter: {game.gamemaster}
			</div>
			<div style={{ margin: "5px", width: "calc(100%-10px)" }}>
				<Button
					variant="contained"
					fullWidth
					color="success"
					disabled={game.status != "open"}
					onClick={() => {
						window.location.href = "/game/player/" + game.id;
					}}
				>
					Beitreten
				</Button>
			</div>
			{AccessibleBy.includes(username) || isAdmin ? (
				<div style={{ margin: "5px", width: "calc(100%-10px)" }}>
					<Button
						fullWidth
						variant="contained"
						onClick={() => {
							window.location.href = "/game/master/" + game.id;
						}}
					>
						Gamemaster
					</Button>
				</div>
			) : (
				<></>
			)}
			{username == game.gamemaster || isAdmin ? (
				<div>
					<div style={{ margin: "5px", width: "calc(100%-10px)" }}>
						<Button
							color="error"
							fullWidth
							variant="contained"
							onClick={onOpen}
						>
							Spiel Transferieren
						</Button>
					</div>
				</div>
			) : (
				<></>
			)}
		</Paper>
	);
}
