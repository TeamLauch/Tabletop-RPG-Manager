import { ITEMS } from "@/utils/defaultItems";
import { Button, ButtonGroup, Input, styled } from "@mui/material";
import axios from "axios";

/**
 *
 * @param w Margin for NavBar
 * @returns A Admin Site
 */
export default function DnDAdminPage() {
	const handleFileUploadNormal = async (event: any) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append("file", file);

		// Send formData to server-side endpoint
		const response = await fetch("/api/admin/loadJsonExport", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			// File uploaded successfully
		} else {
			// Handle error
		}
	};

	const handleFileUploadCharacter = async (event: any) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append("file", file);

		// Send formData to server-side endpoint
		const response = await fetch("/api/admin/loadCharacterJsonExport", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			// File uploaded successfully
		} else {
			// Handle error
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<div style={{ textAlign: "center", fontSize: "20pt" }}>
				Admineinstellungen
			</div>
			<div style={{ textAlign: "center", fontSize: "16pt" }}>
				Standart Daten Laden
			</div>
			<div style={{ flexDirection: "row" }}>
				<div>
					Import JSON <br />
					<input type="file" onChange={handleFileUploadNormal} />
				</div>
				<Button
					variant="contained"
					href="/api/admin/getJsonExport"
					download="defaultData.json"
				>
					Export JSON
				</Button>
			</div>
			<div style={{ textAlign: "center", fontSize: "16pt" }}>
				Character Daten Laden
			</div>
			<div style={{ flexDirection: "row" }}>
				<div>
					Import JSON <br />
					<input type="file" onChange={handleFileUploadCharacter} />
				</div>
				<Button
					variant="contained"
					href="/api/admin/getCharacterJsonExport"
					download="characterData.json"
				>
					Export JSON
				</Button>
			</div>
			<div style={{ flexDirection: "row" }}>
				<Button
					onClick={async () => {
						await axios.get("/api/admin/loadCV");
					}}
					variant="contained"
				>
					Reload Klassen und Völker
				</Button>
				<Button
					onClick={async () => {
						await axios.get("/api/admin/loadMonster");
					}}
					variant="contained"
				>
					Reload NPCs
				</Button>
				<Button
					onClick={async () => {
						await axios.get("/api/admin/loadSpells");
					}}
					variant="contained"
				>
					Reload Zauber
				</Button>
				<Button
					onClick={async () => {
						await axios.post("/api/item/createItems", { data: ITEMS });
					}}
					variant="contained"
				>
					Generate Default Items{" "}
				</Button>
			</div>
		</div>
	);
}
