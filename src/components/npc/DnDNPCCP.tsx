import { Button, IconButton } from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";
import { useNPCs } from "@/utils/customHooks";
import DnDListComponent from "../basic/DnDListComponent";
import DnDEditNPC from "./DnDEditNPC";
import { Add } from "@mui/icons-material";

/**
 *
 * @param w Margin Left for NavBar
 *
 */
export default function DnDNPCCP() {
	const [updateTick, setUpdateTick] = useState(0);

	const npcs = useNPCs(updateTick);
	const [editId, setEditId] = useState("-1");

	const currentNPC = useMemo(() => {
		if (!npcs) {
			return undefined;
		}
		for (let npc of npcs) {
			if (npc.id == editId) {
				return npc;
			}
		}

		return undefined;
	}, [editId, npcs]);

	if (editId == "-2") {
		return (
			<DnDEditNPC
				npc={undefined}
				onClose={() => {
					setEditId("-1");
				}}
				onSave={async (data) => {
					if (!data) {
						setEditId("-1");
						setUpdateTick(updateTick + 1);
						return;
					}
					await axios.post("/api/npc/setNPC", { data: data });
					setEditId("-1");
					setUpdateTick(updateTick + 1);
					return;
				}}
			></DnDEditNPC>
		);
	}

	if (editId != "-1") {
		return (
			<DnDEditNPC
				npc={currentNPC}
				onClose={() => {
					setEditId("-1");
				}}
				onSave={async (data) => {
					if (!data) {
						setEditId("-1");
						setUpdateTick(updateTick + 1);
						return;
					}
					await axios.post("/api/npc/setNPC", { data: data });
					setEditId("-1");
					setUpdateTick(updateTick + 1);
					return;
				}}
			></DnDEditNPC>
		);
	}

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				overflowWrap: "break-word",
				flexGrow: "1",
				justifyContent: "flex-start",
				flexWrap: "wrap",
			}}
		>
			<DnDListComponent
				searchfield
				additionalButtons={
					<IconButton
						onClick={() => {
							setEditId("-2");
						}}
					>
						<Add></Add>
					</IconButton>
				}
				nosort={false}
				list={npcs ?? []}
				bodys={[
					{ location: "volk", name: "Volk", filterable: true },
					{ name: "Trefferpunkte", location: "hp" },
					{ name: "Rüstungsklasse", location: "rk", filterable: true },
					{
						name: "Herausforderungsgrad",
						location: "data.hg",
						filterable: true,
					},
				]}
				filter
				onClick={(item) => {
					setEditId(item.id);
				}}
			></DnDListComponent>
		</div>
	);
}
