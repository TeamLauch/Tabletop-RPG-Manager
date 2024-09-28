import { Backdrop, Button, css, styled, SxProps, Theme } from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";

/**
 * @Params
 * open: State if Modal is open (boolean)
 * onClose: Function to change the state to close (false)
 * children: Child Components. Will be renderd inside the component
 * commitLable: Text in the Commit Button
 * closeLable: Text in the Close Button
 * onCommit: Function, what should happen when the Modal is submitted
 * disableCommit: Disables The CommitButton, usefull if u have something that is not a Form
 * disableAnimation: currently not in use and not implemented may do it in the future
 *
 * @returns a Modal
 */
const ModalContent = styled("div")(
	({ theme }) => css`
		font-family: "IBM Plex Sans", sans-serif;
		font-weight: 500;
		text-align: start;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 8px;
		overflow: hidden;
		background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
		border-radius: 8px;
		border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
		box-shadow: 0 4px 12px
			${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
		padding: 24px;
		color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

		& .modal-title {
			margin: 0;
			line-height: 1.5rem;
			margin-bottom: 8px;
		}

		& .modal-description {
			margin: 0;
			line-height: 1.5rem;
			font-weight: 400;
			color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
			margin-bottom: 4px;
		}
	`
);
const StyledBackdrop = styled(Backdrop)`
	z-index: -1;
	position: fixed;
	inset: 0;
	-webkit-tap-highlight-color: transparent;
`;

const Modal = styled(BaseModal)`
	position: fixed;
	z-index: 1300;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;
export default function DnDModal({
	open,
	onClose,
	children,
	commitLable,
	closeLable,
	onCommit,
	disableCommit,
	disableAbort,
	disableAnimation,
	sx,
}: {
	open: any;
	onClose: any;
	children: any;
	commitLable?: String;
	onCommit?: any;
	closeLable?: String;
	disableCommit?: boolean;
	disableAnimation?: boolean;
	disableAbort?: boolean;
	sx?: SxProps<Theme>;
}) {
	return (
		<Modal
			aria-labelledby="unstyled-modal-title"
			aria-describedby="unstyled-modal-description"
			open={open}
			onClose={onClose}
			slots={{ backdrop: StyledBackdrop }}
			keepMounted={open}
		>
			<ModalContent sx={{ width: 400, ...sx }}>
				{children}
				{!disableAbort ? <br /> : <></>}
				{disableCommit ? (
					<></>
				) : (
					<>
						<Button onClick={onCommit} variant="outlined">
							{commitLable != null ? commitLable : "Speichern"}
						</Button>
						<br />
					</>
				)}
				{!disableAbort ? (
					<Button
						onClick={onClose}
						color="error"
						variant="outlined"
						size="medium"
					>
						{closeLable != null ? closeLable : "Abbrechen"}
					</Button>
				) : (
					<></>
				)}
			</ModalContent>
		</Modal>
	);
}
