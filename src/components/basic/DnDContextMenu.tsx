import { MenuList, Paper } from "@mui/material";

export default function DnDContextMenu({
	posX,
	posY,
	children,
}: {
	posX: string;
	posY: string;
	children: any;
}) {
	return (
		<Paper
			sx={{
				width: 240,
				position: "absolute",
				top: parseInt(posY) - 170,
				left: posX,
				zIndex: "100",
			}}
		>
			<MenuList>{children}</MenuList>
		</Paper>
	);
}
