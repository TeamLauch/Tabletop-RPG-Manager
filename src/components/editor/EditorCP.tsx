import React, { useState, useEffect, useCallback } from "react";
import { config, MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import axios from "axios";
import DE_DE from "@vavt/cm-extension/dist/locale/de-DE";
import { Typography, TextField, Button } from "@mui/material";
import { useRouter } from "next/router";
import crypto from "crypto";
import { WikiEntry } from "prisma";
import { WikiTreeNode } from "@/utils/types";

// Configuring the Markdown editor with a German locale
config({
	editorConfig: {
		languageUserDefined: {
			"de-DE": DE_DE,
		},
	},
});

const secret = process.env.NEXT_PUBLIC_SECRET_TOKEN;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Function to generate an authentication token
function generateToken(): string {
	if (!secret) {
		throw new Error("SECRET_TOKEN is not defined in environment variables");
	}
	return crypto
		.createHmac("sha256", secret)
		.update("getServerSideProps")
		.digest("hex");
}

interface IndexProps {
	Node: WikiTreeNode | null;
	_error: string | null;
	changeState: () => void;
	handleSave: (
		Node: WikiTreeNode | null,
		title: string,
		text: string,
		parentId?: string
	) => void;
	handleDelete: (Node: WikiTreeNode | null) => void;
}

const getEntry = async (id: string) => {
	const res = await axios.get("/api/wiki/get", { params: { id: id } });
	return res.data;
};

const EditorCP: React.FC<IndexProps> = ({
	Node,
	_error,
	changeState,
	handleSave,
	handleDelete,
}) => {
	const [text, setText] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [parentId, setParentId] = useState<string | null>(null);
	const [entries, setEntries] = useState<WikiEntry[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchEntry = async () => {
			if (Node?.id) {
				try {
					const data = await getEntry(Node.id);
					setText(data.content || "");
					setTitle(data.title || "");
					setParentId(data.parentId || null);
				} catch (error) {
					console.error("Error fetching entry:", error);
				}
			}
		};

		fetchEntry();
	}, [Node]);

	useEffect(() => {
		const fetchEntries = async () => {
			try {
				const token = generateToken();
				const response = await axios.get(`${baseURL}/api/wiki/getAll`, {
					headers: { "X-Token": token },
				});
				setEntries(response.data);
			} catch (error) {
				console.error("Error fetching entries:", error);
			}
		};

		fetchEntries();
	}, []);

	const handleSaveButton = () => {
		handleSave(Node, title, text, parentId);
		changeState();
	};

	return (
		<div>
			<div
				style={{
					marginBottom: "1em",
					marginTop: "1em",
					marginLeft: "auto",
					marginRight: "auto",
				}}
			>
				<Typography variant="h2" component="h2">
					Wikieintrag bearbeiten
				</Typography>
			</div>
			<TextField
				label="Titel"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
				style={{ marginBottom: "1em" }}
			/>
			<TextField
				select
				label="Übergeordneter Eintrag"
				value={parentId || ""}
				onChange={(e) => setParentId(e.target.value)}
				SelectProps={{ native: true }}
				fullWidth
				style={{ marginBottom: "1em" }}
			>
				<option key="none" value="">
					Kein übergeordneter Eintrag
				</option>
				{entries.map((entry) => (
					<option key={entry.id} value={entry.id}>
						{entry.title}
					</option>
				))}
			</TextField>
			<MdEditor
				style={{
					backgroundColor: "rgba(200, 200, 255, 0.2)",
					borderRadius: "5px",
				}}
				language="de-DE"
				modelValue={text}
				onChange={setText}
				onSave={() => {
					handleSave(Node, title, text, parentId);
				}}
			/>
			<Button
				onClick={handleSaveButton}
				variant="contained"
				color="primary"
				style={{ marginTop: "1em" }}
			>
				Speichern
			</Button>
			<Button
				onClick={() => changeState()}
				variant="contained"
				color="error"
				style={{ marginTop: "1em" }}
			>
				Abbrechen
			</Button>
			<Button
				onClick={() => {
					handleDelete(Node);
				}}
				variant="contained"
				color="error"
				style={{ marginTop: "1em" }}
			>
				Löschen
			</Button>
		</div>
	);
};

export default EditorCP;
