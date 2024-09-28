import { useTick, useWorlds } from "@/utils/customHooks";
import { useMemo, useState } from "react";
import DnDListComponent from "../basic/DnDListComponent";
import { Button, IconButton } from "@mui/material";
import DnDWorldEditCP from "./DnDWorldEditCP";
import axios from "axios";
import { useMask } from "@react-three/drei";
import { Add } from "@mui/icons-material";

export default function DnDWorldCP() {
	const { tick, updateTick } = useTick();
	const worlds = useWorlds(tick);

	const [editId, setEditId] = useState("-2");
	const currentWorld = useMemo(() => {
		if (editId == "-2" || editId == "-1") {
			return undefined;
		}
		for (let w of worlds) {
			if (w.id == editId) {
				return w;
			}
		}
		return undefined;
	}, [editId]);

	if (editId != "-2") {
		if (editId == "-1") {
			return (
				<DnDWorldEditCP
					onClose={() => {
						setEditId("-2");
						updateTick();
					}}
					onSave={async (data) => {
						await axios.post("/api/world/setWorld", { data: data });
						updateTick();
					}}
				></DnDWorldEditCP>
			);
		}
		return (
			<DnDWorldEditCP
				data={currentWorld}
				onClose={() => {
					setEditId("-2");
					updateTick();
				}}
				onSave={async (data) => {
					await axios.post("/api/world/setWorld", { data: data });
					setEditId("-2");
					updateTick();
				}}
			></DnDWorldEditCP>
		);
	}

	return (
		<DnDListComponent
			list={worlds}
			bodys={[]}
			nosort={false}
			onClick={(item) => {
				setEditId(item.id);
			}}
			searchfield
			additionalButtons={
				<IconButton
					onClick={() => {
						setEditId("-1");
					}}
				>
					<Add></Add>
				</IconButton>
			}
		></DnDListComponent>
	);
}
