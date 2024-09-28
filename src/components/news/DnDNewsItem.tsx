import { Paper } from "@mui/material";
import { useState } from "react";
import { DnDEditNewsItem } from "./DnDEditNewsItem";
import { MdPreview } from "md-editor-rt";
import { DnDBasicPaper } from "../basic/DnDStyledComponents";

/**
 *
 * @returns A Component displaying News
 */
export default function DnDNewsItem({
	news,
	edit,
	sendTickUpdate,
}: {
	news: any;
	edit: any;
	sendTickUpdate: () => void;
}) {
	const [isEdited, setIsEdited] = useState(false);

	if (isEdited) {
		return (
			<DnDEditNewsItem
				close={() => {
					setIsEdited(false);
				}}
				news={news}
				sendTickUpdate={sendTickUpdate}
			></DnDEditNewsItem>
		);
	}

	return (
		<div
			style={{
				width: "500px",
				marginLeft: "5px",
				marginRight: "5px",
				marginTop: "10px",
				cursor: edit ? "pointer" : "auto",
			}}
			onClick={() => {
				if (edit) {
					setIsEdited(true);
				}
			}}
		>
			<DnDBasicPaper elevation={3}>
				<div
					style={{
						width: "100%",
						textAlign: "center",
						fontSize: "25pt",
					}}
				>
					{news.title}
				</div>
				<MdPreview
					modelValue={news ? news.text : ""}
					style={{
						background: "rgba(255,255,255,0)",
					}}
				></MdPreview>
				<div style={{ width: "100%", textAlign: "right", fontSize: "10pt" }}>
					News von {news.createdBy} @
					{news.createdAt.substring(0, news.createdAt.length - 8)}
				</div>
			</DnDBasicPaper>
		</div>
	);
}
