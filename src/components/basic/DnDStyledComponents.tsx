import { Paper, styled } from "@mui/material";

export const DnDBasicPaper = styled(Paper)({
	background: "rgba(0,0,255,.05)",
	backdropFilter: "blur(8px)",
});

export const DnDEditPaper = styled(Paper)({
	backgroundColor: "rgba(200, 200, 255, 0.2)",
	backdropFilter: "blur(8px)",
});
