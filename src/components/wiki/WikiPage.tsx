import React, { useState, useRef, useCallback } from "react";
import { Button, Container, Grid, Typography, styled } from "@mui/material";
import DnDRenderer from "@/components/wiki/DnDRenderer";
import DnDWikiTree from "@/components/wiki/DnDWikiTree";
import EditorCP from "../editor/EditorCP";
import NewWikiEntry from "./newWikiEntry";
import crypto from "crypto";
import { useEditor } from "@/utils/customHooks";
import axios from "axios";
import { WikiTreeNode } from "@/utils/types";

// Define a styled component for the scrollable div
const ScrollableDiv = styled("div")({
	height: "80vh",
	overflowY: "auto",
	"&::-webkit-scrollbar": {
		width: "8px",
	},
	"&::-webkit-scrollbar-track": {
		backgroundColor: "#f1f1f1",
	},
	"&::-webkit-scrollbar-thumb": {
		backgroundColor: "#888",
		borderRadius: "4px",
	},
	scrollbarWidth: "thin", // For Firefox
	scrollbarColor: "#888 #f1f1f1", // For Firefox
});

const initTreeNode: WikiTreeNode = {
	id: "init",
	label: "Bitte wähle einen Artikel",
	content: "### Bitte wähle einen Artikel",
	children: [],
};

const secret = process.env.NEXT_PUBLIC_SECRET_TOKEN;
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

const WikiPage: React.FC = () => {
	const [selectedArticle, setSelectedArticle] =
		useState<WikiTreeNode>(initTreeNode);
	const scrollElementRef = useRef<HTMLDivElement>(null);
	const [toggleEdit, setToggleEdit] = useState(false);
	const [toggleEditor, setToggleEditor] = useState(false);
	const { isEditor } = useEditor();

	const handleSelectArticle = (article: WikiTreeNode) => {
		setSelectedArticle(article);
		console.log("Selected article ID: " + article.id);
		// Scroll to top of the scrollable area when a new article is selected
		if (scrollElementRef.current) {
			scrollElementRef.current.scrollTop = 0;
		}
	};

	const handleEdit = () => {
		setToggleEditor(true);
	};

	const handleCreate = () => {
		setToggleEdit(true);
	};

	const handleToggle = () => {
		setToggleEditor(false);
	};

	const handleSave = async (Node, title, text, parentId?) => {
		try {
			const token = generateToken();
			await axios.post(
				"/api/wiki/update",
				{ id: Node?.id, title, content: text, parentId },
				{
					headers: { "x-token": token },
				}
			);
		} catch (error) {
			console.error("Error saving post:", error);
		}
	};

	const handleDelete = async (Node) => {
		try {
			const token = generateToken();
			await axios.post(
				"/api/wiki/delete",
				{ id: Node?.id },
				{
					headers: { "x-token": token },
				}
			);
		} catch (error) {
			console.error("Error deleting post:", error);
		}
		handleToggle();
	};

	return (
		<Container sx={{ mt: 1 }}>
			{toggleEditor && isEditor ? (
				<EditorCP
					Node={selectedArticle}
					_error={""}
					changeState={handleToggle}
					handleDelete={handleDelete}
					handleSave={handleSave}
				/>
			) : toggleEdit && isEditor ? (
				<NewWikiEntry
					toggle={setToggleEdit}
					newArticle={setSelectedArticle}
					setEditor={setToggleEditor}
				/>
			) : (
				<Grid container spacing={2}>
					{/* Sidebar with DnDWikiTree */}
					<Grid item xs={3}>
						<DnDWikiTree onSelectArticle={handleSelectArticle} />
						{isEditor && (
							<>
								<Button
									variant="contained"
									onClick={handleCreate}
									color="primary"
								>
									Create
								</Button>
								{selectedArticle && (
									<>
										<Button
											variant="contained"
											onClick={handleEdit}
											color="primary"
										>
											Edit
										</Button>
									</>
								)}
							</>
						)}
					</Grid>

					{/* Main content area */}
					<Grid item xs={8}>
						<ScrollableDiv ref={scrollElementRef}>
							<DnDRenderer
								text={selectedArticle.content}
								id={selectedArticle.label}
							/>
						</ScrollableDiv>
					</Grid>
				</Grid>
			)}
		</Container>
	);
};

export default WikiPage;
