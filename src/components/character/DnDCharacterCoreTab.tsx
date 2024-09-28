import { TabPanel } from "@mui/lab";
import DnDFieldValueEditor from "../fields/DnDFieldValueEditor";
import { Field } from "@/utils/types";

/**
 *
 * @param character Data of the Character
 * @param setCharacter Changes the Character
 * @param Fields Fields for this Tab
 * @param tabValue key of this Tab
 * @param constData constants from database
 * @returns A Component for a Tab
 */
export default function DnDCharacterCoreTab({
	character,
	setCharacter,
	fields,
	tabValue,
	constData,
}: {
	constData: any;
	character: any;
	setCharacter: any;
	fields: Field[];
	tabValue: string;
}) {
	return (
		<TabPanel value={tabValue}>
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				{fields.map((item: any) => {
					return (
						<DnDFieldValueEditor
							key={tabValue + "_TABCORE_" + item.location}
							field={item}
							setData={setCharacter}
							data={character}
							constData={constData}
						></DnDFieldValueEditor>
					);
				})}
			</div>
		</TabPanel>
	);
}
