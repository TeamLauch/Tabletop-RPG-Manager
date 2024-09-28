import { useTick, useUsers } from "@/utils/customHooks";
import axios from "axios";
import { useState } from "react";
import DnDEditUserCp from "./DnDEditUserCP";
import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";

/**
 *
 * @param w Width of Nav bar
 * @param setError Function for Displaying a Error Message
 * @returns A Component for Listing Users and Updating them
 */
export default function DnDUserCp({ setError }: { setError: any }) {
	const [createUser, setCreateUser] = useState(false);
	const [editUser, setEditUser] = useState(false);
	const [currentUser, setCurrentUser] = useState({});
	const { tick, updateTick } = useTick();
	const users = useUsers(tick);

	const cancel = () => {
		setCreateUser(false);
		setEditUser(false);
	};

	/**
	 *
	 * Creates a user via the API-Route
	 * @param data Data of the User
	 * @returns
	 */
	const handleCreate = async (data: any) => {
		try {
			const response = await axios.post("/api/user/createUser", data);

			if (response.status != 200) {
				setError("Internal Server Error");
				return;
			}
			if (response.data.error) {
				setError(response.data.message);
				return;
			}
			setCreateUser(false);
		} catch (error) {
			setError("Error");
		}
		updateTick();
	};

	/**
	 * Updates Userdata via the API-Route
	 * @param data Data of the User
	 */
	const handleEdit = async (data: any) => {
		try {
			const response = await axios.post("/api/user/editUser", data);
			console.log(response);

			if (!response.data.success) {
				setError(response.data.error);
				console.log(response.data.error);
			}
			setCreateUser(false);
		} catch (e) {
			setError("Error" + { e });
		}
		updateTick();
	};

	/**
	 * Deaktivates/Activates User
	 * @param user User to toggle Activision
	 * @returns
	 */
	const toggleActivate = async (user: any) => {
		try {
			const response = await axios.post("/api/user/editUser", {
				username: user.username,
				password: "",
				role: user.roles,
				pwChanged: false,
				activated: !user.activated,
			});
			if (response.status != 200) {
				setError("Internal Server Error");
				return;
			}
			if (response.data.error) {
				setError(response.data.message);
				return;
			}
		} catch (error) {
			setError("Internal Server Error");
			return;
		}
		updateTick();
	};

	/**
	 * Deaktivates/Activates User
	 * @param user User to toggle Activision
	 * @returns
	 */
	const toggleCanUpload = async (user: any) => {
		try {
			const response = await axios.post("/api/user/toggleCanUpload", {
				username: user.username,
			});
			if (response.status != 200) {
				setError("Internal Server Error");
				return;
			}
			if (response.data.error) {
				setError(response.data.message);
				return;
			}
		} catch (error) {
			setError("Internal Server Error");
			return;
		}
		updateTick();
	};

	return (
		<>
			{createUser ? (
				<DnDEditUserCp handleSave={handleCreate} u={null} cancel={cancel} />
			) : (
				<></>
			)}
			{editUser ? (
				<DnDEditUserCp
					handleSave={handleEdit}
					u={currentUser}
					cancel={cancel}
				/>
			) : (
				<></>
			)}
			{!createUser && !editUser ? (
				<>
					<div
						style={{
							marginTop: "10px",
							width: "98%",
							marginLeft: "1%",
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								setCreateUser(true);
								setEditUser(false);
							}}
						>
							Benutzer hinzufügen
						</Button>
					</div>
					<TableContainer
						component={Paper}
						style={{
							width: "98%",
							marginLeft: "1%",
							marginTop: "10px",
							backgroundColor: "rgba(0, 0, 255, 0.1)",
						}}
					>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Benutzername</TableCell>
									<TableCell>E-Mail</TableCell>
									<TableCell>Rolle</TableCell>
									<TableCell>Aktiviert</TableCell>
									<TableCell>Aktionen</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{users.map((item: any) => {
									return (
										<TableRow key={item.name}>
											<TableCell
												onClick={() => {
													setCurrentUser(item);
													setCreateUser(false);
													setEditUser(true);
												}}
											>
												{item.username}
											</TableCell>
											<TableCell
												onClick={() => {
													setCurrentUser(item);
													setCreateUser(false);
													setEditUser(true);
												}}
											>
												{item.email}
											</TableCell>
											<TableCell
												onClick={() => {
													setCurrentUser(item);
													setCreateUser(false);
													setEditUser(true);
												}}
											>
												{item.roles}
											</TableCell>
											<TableCell
												onClick={() => {
													setCurrentUser(item);
													setCreateUser(false);
													setEditUser(true);
												}}
											>
												{item.activated ? <b>Ja</b> : <b>Nein</b>}
											</TableCell>
											<TableCell>
												<Button
													variant="contained"
													color={!item.activated ? "success" : "error"}
													onClick={() => {
														toggleActivate(item);
													}}
												>
													{item.activated ? "Deaktivieren" : "Aktivieren"}
												</Button>
												<Button
													variant="contained"
													color={!item.canUpload ? "success" : "error"}
													onClick={() => {
														toggleCanUpload(item);
													}}
												>
													{item.canUpload
														? "Upload Sperren"
														: "Upload Entsperren"}
												</Button>
												<Button
													variant="contained"
													color={"error"}
													onClick={async () => {
														await axios.post("/api/user/deleteUser", {
															username: item.username,
														});
														updateTick();
													}}
												>
													Löschen
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>{" "}
				</>
			) : (
				<></>
			)}
		</>
	);
}
