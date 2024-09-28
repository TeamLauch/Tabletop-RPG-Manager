import { styled } from "@mui/material";
import { useMemo } from "react";
import { displayPartsToString } from "typescript";

const TimelineIconBlock = styled("div")({
	backgroundColor: "#A5A5F5",
	width: "3vw",
	gridColumn: "1",
	gridRow: "1",
	height: "3vw",
});
const TimelineIconCircle = styled("div")({
	backgroundColor: "#F5A5A5",
	width: "3vw",
	height: "3vw",
	gridColumn: "1",
	gridRow: "1",
	borderRadius: "1.5vw",
});
const TimelineIconTriangle = styled("div")({
	width: "0",
	height: "0",
	marginLeft: "0vw",
	gridColumn: "1",
	gridRow: "1",
	borderTop: "1.5vw solid transparent",
	borderBottom: "1.5vw solid transparent",
	borderLeft: "3vw solid #A5F5A5",
	transform: "rotate(90deg)",
});

const TimelineLine = styled("div")({
	marginBottom: "-10px",
	width: ".5vw",
	backgroundColor: "#A5A5A5A6",
	gridColumn: "1",
	gridRow: "1",
	zIndex: "-1",
	position: "relative",
});

const EventContainer = styled("div")({
	display: "grid",
	gridTemplateColumns: "1fr 6fr",
	justifyContent: "center",
	justifyItems: "center",
});

export default function DnDCharacterRoleplayEventCP({
	events,
	dateNumberToWorldDate,
	timeNumberToTimeString,
}: {
	events: any;
	dateNumberToWorldDate: (date: number) => string;
	timeNumberToTimeString: (time: number) => string;
}) {
	const sortedEvents = useMemo(() => {
		if (!events) {
			return [];
		}
		return events.sort((a, b) => {
			if (parseInt(a.date) < parseInt(b.date)) {
				return 1;
			}
			if (parseInt(a.date) > parseInt(b.date)) {
				return -1;
			}
			if (parseInt(a.time) < parseInt(b.time)) {
				return 1;
			}
			if (parseInt(a.time) > parseInt(b.time)) {
				return -1;
			}
			return 0;
		});
	}, [events]);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr",
				gridTemplateRows: "1fr",
				gridAutoRows: "1fr",
				gridGap: "10px",
				height: "100%",
				overflow: "auto",
			}}
		>
			{sortedEvents.map((item, index) => {
				return (
					<EventContainer key={item.name + "" + index}>
						{item.etype == "rast" ? (
							<TimelineIconTriangle></TimelineIconTriangle>
						) : (
							<></>
						)}
						{item.etype == "fight" ? (
							<TimelineIconTriangle
								style={{ transform: "rotate(270deg)" }}
							></TimelineIconTriangle>
						) : (
							<></>
						)}
						{item.etype == "quest" ? (
							<TimelineIconCircle></TimelineIconCircle>
						) : (
							<></>
						)}
						{item.etype == "action" ? (
							<TimelineIconCircle
								style={{
									backgroundColor: "#F5A5F5",
								}}
							></TimelineIconCircle>
						) : (
							<></>
						)}
						{item.etype == "other" ? (
							<TimelineIconBlock></TimelineIconBlock>
						) : (
							<></>
						)}
						<TimelineLine></TimelineLine>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gridColumn: "2",
								gridRow: "1",
							}}
						>
							<div style={{ fontSize: "18pt", textAlign: "center" }}>
								<b>{item.name}</b>
							</div>
							<div style={{ fontSize: "14pt", textAlign: "center" }}>
								{dateNumberToWorldDate(parseInt(item.date)) +
									"  " +
									timeNumberToTimeString(parseInt(item.time))}
							</div>
						</div>
					</EventContainer>
				);
			})}
		</div>
	);
}
