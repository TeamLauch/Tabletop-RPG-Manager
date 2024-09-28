import { IconButton, Switch, Tooltip } from "@mui/material";
import { deleteNPC, registerTokenToMap, saveNPC } from "@/utils/game";
import {
	ColorLens,
	Delete,
	EditLocation,
	SwapHoriz,
	VisibilityOff,
} from "@mui/icons-material";
import { useUsernames } from "@/utils/customHooks";
import { CSSProperties, MouseEventHandler, useMemo } from "react";
import DnDCharacterImage from "../characterviewer/DnDCharacterImage";
export default function DnDGamemasterNPCItemCP({
	onClick,
	item,
	setCustomContext,
	style,
	image,
}: {
	onClick?: MouseEventHandler<HTMLDivElement>;
	item: any;
	image?: boolean;
	setCustomContext?: any;
	style?: CSSProperties;
}) {
	return (
		<div
			onClick={onClick}
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
			style={{
				cursor: "pointer",
				border: "1px solid black",
				boxShadow: "2px 2px rgba(0,0,0,0.25)",
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
					gridTemplateColumns: "1fr 7fr",
					gridTemplateRows: "auto",
					display: "grid",
					marginBottom: "10px",
				}}
			>
				<div style={{ aspectRatio: "1" }}>
					<DnDCharacterImage src=""></DnDCharacterImage>
				</div>
				<div>
					<b>{item.name}</b>{" "}
					{item.owner ? (
						<>
							<br />
							<div style={{ fontSize: "15pt" }}>Besitzer: {item.owner}</div>
						</>
					) : (
						<></>
					)}
				</div>
			</div>
			<div>HP: {item.hp}</div>
			<div>RK: {item.rk}</div>
			{item.volk ? <div>Volk: {item.volk}</div> : <></>}
			{item.hg ? <div>HG: {item.hg}</div> : <></>}
		</div>
	);
}
