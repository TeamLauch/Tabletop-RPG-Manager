import { saveNews } from "@/utils/news";
import { Button, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { config, MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import DE_DE from "@vavt/cm-extension/dist/locale/de-DE";
import { DnDBasicPaper } from "../basic/DnDStyledComponents";

// Configuring the Markdown editor with a German locale
config({
	editorConfig: {
		languageUserDefined: {
			"de-DE": DE_DE,
		},
	},
});
/**
 *
 * @returns A Component for Editing News
 */
export function DnDEditNewsItem({
	news,
	sendTickUpdate,
	close,
}: {
	news: any;
	sendTickUpdate: () => void;
	close: () => void;
}) {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");

	useEffect(() => {
		if (!news) {
			return;
		}
		setTitle(news.title);
		setText(news.text);
	}, [news]);

	const handleSave = async () => {
		await saveNews({ ...news, title: title, text: text });
		sendTickUpdate();
		close();
	};

	return (
		<div
			style={{
				width: "100%",
				marginLeft: "5px",
				marginRight: "5px",
				marginTop: "10px",
			}}
		>
			<DnDBasicPaper elevation={3}>
				<div
					style={{
						marginLeft: "10px",
						marginRight: "10px",
					}}
				>
					<TextField
						label="Titel"
						value={title}
						fullWidth
						onChange={(e) => {
							setTitle(e.target.value);
						}}
					></TextField>

					<MdEditor
						language="de-DE"
						modelValue={text}
						style={{
							background: "rgba(255,255,255,0)",
						}}
						onChange={setText}
						onSave={() => {
							handleSave();
						}}
					/>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-around",
						}}
					>
						<Button
							variant="contained"
							color="success"
							onClick={() => handleSave()}
						>
							{" "}
							Speichern
						</Button>

						<Button
							variant="contained"
							color="error"
							onClick={() => {
								close();
							}}
						>
							Abbrechen
						</Button>
					</div>
				</div>
			</DnDBasicPaper>
		</div>
	);
}
