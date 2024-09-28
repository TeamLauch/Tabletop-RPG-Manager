import { Typography } from "@mui/material";

export default function DnDGamemasterMapItemCP({
	setCustomContext,
	item,
	setCurrentPlayerId,
	setCurrentNPCId,
	onClick,
	players,
	npcs,
	style,
}: {
	setCustomContext: any;
	item: any;
	setCurrentPlayerId: any;
	setCurrentNPCId: any;
	onClick: any;
	style?: any;
	players?: any[];
	npcs?: any;
}) {
	return (
		<div
			style={{
				marginBottom: "5px",
			}}
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
		>
			<div
				onClick={onClick}
				style={{
					cursor: "pointer",
					border: "1px solid black",
					borderRadius: "10px",
					display: "flex",
					flexDirection: "column",
					textAlign: "left",
					...style,
				}}
			>
				<div
					style={{
						textAlign: "center",
						fontSize: "20pt",
						width: "100%",
						marginBottom: "10px",
					}}
				>
					<div>
						<b>{item.name}</b>
						<br />
					</div>
				</div>
			</div>

			{players || npcs ? (
				<div
					style={{
						width: "calc(100% - 20px)",
						border: "1px solid black",
						borderRadius: "0 0 10px 10px",
						marginLeft: "10px",
						backgroundColor: style ? style.backgroundColor : undefined,
						transition: "display 0.5s ease-out",
					}}
				>
					{players ? (
						<>
							<Typography variant="body1">Spieler:</Typography>
							{players.map((item) => {
								return (
									<li key={"map_p_" + item.id} style={{ marginLeft: "5px" }}>
										{item.name} ({item.owner})
									</li>
								);
							})}
						</>
					) : (
						<></>
					)}
					{npcs ? (
						<>
							<Typography variant="body1">NSCs:</Typography>
							{npcs.map((item) => {
								return (
									<li key={"map_p_" + item.id} style={{ marginLeft: "5px" }}>
										{item.name}
									</li>
								);
							})}
						</>
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
