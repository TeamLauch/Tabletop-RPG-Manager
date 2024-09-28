import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Close } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import {
	Backdrop,
	Button,
	css,
	Dialog,
	styled,
	SxProps,
	Theme,
} from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";

const ModalContent = styled("div")(
	({ theme }) => css`
		font-family: "IBM Plex Sans", sans-serif;
		font-weight: 500;
		text-align: start;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 8px;
		overflow: auto;
		background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
		border-radius: 8px;
		border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
		box-shadow: 0 4px 12px
			${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
		padding: 24px;
		color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};
	`
);

const StyledBackdrop = styled(Backdrop)`
	z-index: -1;
	position: fixed;
	inset: 0;
	-webkit-tap-highlight-color: transparent;
`;

const Modal = styled(Dialog)`
	position: fixed;
	z-index: 1300;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;
/**
 *
 * @param children Components inside the Popup
 * @param onClose Determens what happens on Close
 * @param title Title of the Popup
 * @returns A Popup Overlapping all other Components
 */
export default function DnDPopUpMenu({
	children,
	onClose,
	title = "Test",
	width,
	sx,
}: {
	width?: string;
	title: string;
	children: any;
	onClose: () => void;
	sx?: SxProps<Theme>;
}) {
	return (
		<Modal
			open={true}
			onClose={onClose}
			slots={{ backdrop: StyledBackdrop }}
			keepMounted={true}
		>
			<ModalContent sx={{ ...sx, minWidth: "400px" }}>
				{title ? <Typography variant="h4">{title}</Typography> : <></>}
				{children}
			</ModalContent>
		</Modal>
	);
}
