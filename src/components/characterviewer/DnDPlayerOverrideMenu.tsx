import { getFieldData, updateField } from "@/utils/dataHelper";
import { Add, Delete } from "@mui/icons-material";
import {
	IconButton,
	Table,
	TableCell,
	TableRow,
	TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export default function DnDPlayerOverrideMenu({
	player,
	character,
	savePlayer,
}: {
	player: any;
	character: any;
	savePlayer: (playerData: any) => void;
}) {
	const [newLocation, setNewLocation] = useState<{
		location: string;
		value: string;
	}>();

	const flatLocations = useMemo(() => {
		let ret: { location: string; value: any; characterValue: string }[] = [];
		if (!player || !player.override) {
			return ret;
		}
		let entrys = Object.entries(player.override);
		if (!entrys) {
			return [];
		}
		let subEntrys = [];
		while (entrys.length > 0) {
			for (let e of entrys) {
				if (typeof e[1] == "object" && !Array.isArray(e[1])) {
					let ne = Object.entries(e[1]);
					ne = ne.map((item) => {
						item[0] = e[0] + "." + item[0];
						return item;
					});
					subEntrys = [...subEntrys, ...ne];
					continue;
				}
				ret.push({
					location: e[0],
					value: e[1],
					characterValue: getFieldData(character, e[0]),
				});
			}
			entrys = [...subEntrys];
			subEntrys = [];
		}
		return ret;
	}, [player, character]);

	return (
		<Table>
			<TableRow sx={{ textAlign: "center" }}>
				<TableCell sx={{ width: "80px" }}>Aktionen</TableCell>
				<TableCell sx={{ width: "200px" }}>Location</TableCell>
				<TableCell sx={{ width: "100px" }}>Value</TableCell>
				<TableCell sx={{ width: "80px" }}>Default Value</TableCell>
			</TableRow>
			{flatLocations.map((item) => {
				return (
					<TableRow key={item.location + "-key-row"}>
						<TableCell>
							<IconButton
								onClick={async () => {
									await savePlayer(
										updateField(
											player,
											"override." + item.location,
											undefined,
											true
										)
									);
								}}
							>
								<Delete></Delete>
							</IconButton>
						</TableCell>
						<TableCell>{item.location}</TableCell>
						<TableCell>{item.value}</TableCell>
						<TableCell>
							<b>{item.characterValue}</b>
						</TableCell>
					</TableRow>
				);
			})}
			<TableRow>
				<TableCell>
					<IconButton
						onClick={async () => {
							await savePlayer(
								updateField(
									player,
									"override." + newLocation.location,
									newLocation.value,
									true
								)
							);
							setNewLocation(null);
						}}
					>
						<Add></Add>
					</IconButton>
				</TableCell>
				<TableCell>
					<TextField
						value={newLocation ? newLocation.location : ""}
						onChange={(e) => {
							if (!newLocation) {
								setNewLocation({
									location: e.target.value,
									value: "",
								});
								return;
							}
							setNewLocation((prev) => ({
								...prev,
								location: e.target.value,
							}));
						}}
					></TextField>
				</TableCell>

				<TableCell>
					<TextField
						value={newLocation ? newLocation.value : ""}
						onChange={(e) => {
							if (!newLocation) {
								setNewLocation({
									value: e.target.value,
									location: "",
								});
								return;
							}
							setNewLocation((prev) => ({
								...prev,
								value: e.target.value,
							}));
						}}
					></TextField>
				</TableCell>
			</TableRow>
		</Table>
	);
}
