import { Typography } from "@mui/material";
import { useMemo, useState } from "react";
import DnDCharacterRoleplayQuestViewer from "./DnDCharacterRoleplayQuestViewer";
import { DnDCharacterSheetDescriptionText } from "../DnDCharacterSheetCP";

function QuestViewer({
	setSelectedQuest,
	selectedQuest,
	quests,
}: {
	setSelectedQuest: any;
	selectedQuest: any;
	quests: any[];
}) {
	return (
		<>
			<div
				style={{
					padding: "5px",
					flexDirection: "column",
					overflowY: "auto",
					display: "flex",
				}}
			>
				{quests.map((item, index) => {
					if (index == 0) {
						if (item.solved) {
							return (
								<>
									<DnDCharacterSheetDescriptionText
										key={"trenner"}
										style={{ textAlign: "center" }}
									>
										Abgeschlossen
									</DnDCharacterSheetDescriptionText>
									<div
										key={item.name + "_" + index}
										style={{
											border: "1px solid black",
											marginTop: "5px",
											textAlign: "center",
											marginBottom: "5px",
											borderRadius: "5px",
											cursor: "pointer",
											backgroundColor:
												index == selectedQuest ? "#DADAF5" : undefined,
										}}
										onClick={(e) => {
											setSelectedQuest(index);
										}}
									>
										<Typography
											variant="h5"
											style={{
												fontStyle: item.solved ? "italic" : undefined,
											}}
										>
											{item.qtype == "main" && item.active ? (
												<b>{item.name}</b>
											) : (
												item.name
											)}
										</Typography>
									</div>
								</>
							);
						}
					}

					if (index - 1 >= 0 && !quests[index - 1].solved && item.solved) {
						return (
							<>
								<DnDCharacterSheetDescriptionText
									key={"trenner"}
									style={{ textAlign: "center" }}
								>
									Abgeschlossen
								</DnDCharacterSheetDescriptionText>
								<div
									key={item.name + "_" + index}
									style={{
										border: "1px solid black",
										marginTop: "5px",
										textAlign: "center",
										marginBottom: "5px",
										borderRadius: "5px",
										cursor: "pointer",
										backgroundColor:
											index == selectedQuest ? "#DADAF5" : undefined,
									}}
									onClick={(e) => {
										setSelectedQuest(index);
									}}
								>
									<Typography
										variant="h5"
										style={{
											fontStyle: item.solved ? "italic" : undefined,
										}}
									>
										{item.qtype == "main" && item.active ? (
											<b>{item.name}</b>
										) : (
											item.name
										)}
									</Typography>
								</div>
							</>
						);
					}
					return (
						<div
							key={item.name + "_" + index}
							style={{
								border: "1px solid black",
								marginTop: "5px",
								textAlign: "center",
								marginBottom: "5px",
								borderRadius: "5px",
								cursor: "pointer",
								backgroundColor: index == selectedQuest ? "#DADAF5" : undefined,
							}}
							onClick={(e) => {
								setSelectedQuest(index);
							}}
						>
							<Typography
								variant="h5"
								style={{
									fontStyle: item.solved ? "italic" : undefined,
								}}
							>
								{item.qtype == "main" && item.active ? (
									<b>{item.name}</b>
								) : (
									item.name
								)}
							</Typography>
						</div>
					);
				})}
			</div>
			{selectedQuest > -1 && quests[selectedQuest] ? (
				<div
					style={{
						border: "1px solid black",
						borderRadius: "5px",
						padding: "5px",
						overflow: "auto",
						maxHeight: "400px",
					}}
				>
					<DnDCharacterRoleplayQuestViewer
						quest={quests[selectedQuest]}
					></DnDCharacterRoleplayQuestViewer>
				</div>
			) : (
				<></>
			)}
		</>
	);
}

export default function DnDCharacterRoleplayQuestCP({
	quests,
}: {
	quests: any[];
}) {
	const [selectedQuest, setSelectedQuest] = useState<number>();

	const sortedQuests = useMemo(() => {
		if (!quests) {
			return [];
		}
		return quests.sort((a, b) => {
			if (a.solved) {
				if (b.solved) {
					return 0;
				}
				return 1;
			}
			if (b.solved) {
				return -1;
			}
			if (a.qtype == "main") {
				if (b.qtype == "main") {
					return 0;
				}
				return -1;
			}
			if (b.qtype == "main") {
				return 1;
			}
			return 0;
		});
	}, [quests]);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 2fr",
				height: "100%",
				gridTemplateRows: "1fr",
			}}
		>
			<QuestViewer
				quests={sortedQuests}
				selectedQuest={selectedQuest}
				setSelectedQuest={setSelectedQuest}
			></QuestViewer>
		</div>
	);
}
