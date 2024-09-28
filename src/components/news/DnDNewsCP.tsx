import { useState } from "react";
import { DnDEditNewsItem } from "./DnDEditNewsItem";
import DnDNewsItem from "./DnDNewsItem";
import { useNews } from "@/utils/customHooks";
import { IconButton, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";

/**
 *
 * @returns A Component for Viewing News
 */
export function DnDNewsCP({ edit }: { edit: boolean }) {
	const [updateTick, setUpdateTick] = useState(0);
	const news = useNews(updateTick);

	const [newItem, setNewItem] = useState(false);

	return (
		<div
			style={{
				marginRight: "20px",
				marginTop: "10px",
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gridRow: "auto",
				gridGap: "10px",
			}}
		>
			<div
				style={{
					width: "100%",
					textAlign: "center",
					fontSize: "30pt",
					justifyContent: "center",
					gridColumn: "1 / span 3",
				}}
			>
				News{" "}
				{edit ? (
					<Tooltip title="Neu Nachricht erstellen">
						<IconButton
							onClick={() => {
								setNewItem(true);
							}}
						>
							<Add></Add>
						</IconButton>
					</Tooltip>
				) : (
					<></>
				)}
			</div>
			{newItem ? (
				<DnDEditNewsItem
					close={() => {
						setNewItem(false);
					}}
					news={undefined}
					sendTickUpdate={() => {
						setUpdateTick(updateTick + 1);
					}}
				></DnDEditNewsItem>
			) : (
				<></>
			)}
			{news.map((item) => {
				return (
					<DnDNewsItem
						key={"news_" + item.title}
						edit={edit}
						news={item}
						sendTickUpdate={() => {
							setUpdateTick(updateTick + 1);
						}}
					></DnDNewsItem>
				);
			})}
		</div>
	);
}
