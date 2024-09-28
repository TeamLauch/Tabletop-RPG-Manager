import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";

/**
 *
 * @param c Character
 * @param setEdit Opens EditMenu
 * @param own Is it a Character made by one self.
 * @returns Returns a Character Component
 */
export default function DnDCharacterListItem({
	c,
	setEdit,
	own,
}: {
	c: any;
	setEdit: any;
	own: boolean;
}) {
	return (
		<Button
			onClick={() => {
				setEdit(c);
			}}
			sx={{ width: "15%", margin: "0.5%" }}
		>
			<Card sx={{ width: "100%", background: "rgba(0,0,255,.05)" }}>
				<Avatar
					sx={{
						width: 80,
						height: 80,
						margin: "auto",
						marginTop: 2,
					}}
					src={"/api/file/getImage?type=character&id=" + c.id}
				></Avatar>

				<CardContent>
					{/* Name */}
					<Typography
						variant="h5"
						component="div"
						textAlign="center"
						gutterBottom
					>
						{c.characterName}
					</Typography>

					{/* Description */}
					<Typography variant="body2" color="textSecondary" textAlign="left">
						<b>Volk:</b>
						{c.volk}
					</Typography>
					<Typography variant="body2" color="textSecondary" textAlign="left">
						<b>Hauptklasse:</b>
						{c.classes[0] ?? ""}
					</Typography>
					<Typography variant="body2" color="textSecondary" textAlign="left">
						<b>Hintergrund:</b>
						{c.background}
					</Typography>
					{!own ? (
						<Typography variant="body2" color="textSecondary" textAlign="left">
							<b>Owner:</b>
							{c.ownerId}
						</Typography>
					) : (
						<></>
					)}
				</CardContent>
			</Card>
		</Button>
	);
}
