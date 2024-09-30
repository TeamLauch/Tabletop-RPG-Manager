import DnDErrorMessage from "./DnDErrorMessage";
import { DnDFooter } from "./DnDFooter";
import DnDNavBar from "./DnDNavBar";

/**
 *
 * @param children Components inside the Default Page
 * @param w margin for NavBar
 * @param user User
 * @param navBar Show NavBar
 * @returns Default Page Template. Used in All Pages using Navbar and Footer
 */
export default function DnDDefaultPage({
	children,
	user,
	navBar = false,
	error,
	setError,
}: {
	children?: any;
	user: any;
	navBar: boolean;
	error: string | undefined;
	setError: any;
}) {
	if (!user) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",

					background:
						"radial-gradient(circle, rgba(233,246,235,1) 0%, rgba(209,235,226,1) 48%, rgba(229,242,222,1) 100%)",
				}}
			>
				<div style={{ flex: 1 }}>
					{error && setError ? (
						<DnDErrorMessage setError={setError} text={error}></DnDErrorMessage>
					) : (
						<></>
					)}
					{children ?? <></>}
				</div>
				<DnDFooter />
			</div>
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",

				background:
					"radial-gradient(circle, rgba(233,246,235,1) 0%, rgba(209,235,226,1) 48%, rgba(229,242,222,1) 100%)",
			}}
		>
			{navBar ? <DnDNavBar user={user} /> : <></>}
			<div style={{ flex: 1 }}>
				{error && setError ? (
					<DnDErrorMessage setError={setError} text={error}></DnDErrorMessage>
				) : (
					<></>
				)}
				{children ?? <></>}
			</div>
			<DnDFooter />
		</div>
	);
}
