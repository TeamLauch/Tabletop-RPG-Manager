import DnDCharacterWidgetChild from "./DnDCharacterWidgetChild";
import { WidgetChild } from "@/utils/types";
import { DEFAULT_FUNCTION_TOOLKIT } from "@/utils/constants";

export default function DnDCharacterSheetWidget({
	id,
	title,
	style,
	children,
	openPopup,
	playerData,
	constData,
	characterData,
	savePlayer,
}: {
	id: string;
	title?: string;
	style?: any;
	savePlayer: any;
	children: WidgetChild[];
	openPopup: (id: string, openAttributes: any) => void;
	playerData: any;
	constData: any;
	characterData: any;
}) {
	return (
		<div style={style}>
			{children.map((item) => {
				if (!item) {
					return;
				}

				let v = item.values
					? item.values(
							playerData,
							characterData,
							DEFAULT_FUNCTION_TOOLKIT,
							constData
						)
					: undefined;
				return (
					<DnDCharacterWidgetChild
						characterData={characterData}
						constData={constData}
						id={item.id}
						openPopup={openPopup}
						savePlayer={savePlayer}
						playerData={playerData}
						type={item.type}
						values={v}
						key={id + item.id}
						onClick={item.onClick}
						style={item.style}
						title={item.title}
					></DnDCharacterWidgetChild>
				);
			})}
		</div>
	);
}
