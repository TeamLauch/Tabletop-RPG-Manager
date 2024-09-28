import "@/styles/style.css";
import "@/styles/mainUI.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

/**
 * Default THEME
 */
const theme = createTheme({
	palette: {
		primary: {
			main: "#408066",
			contrastText: "#FFFFFF",
		},
		secondary: {
			main: "#ef5350",
		},
		error: {
			main: "#ef5350",
		},
		success: {
			main: "#afd683",
		},
		text: {
			primary: "#000000", // Black text color
		},
		background: {
			default: "#FFFFFF", // White background color
		},
	},
});

/**
 *
 * @returns Return Sites
 */
export default function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={theme}>
			<Component {...pageProps} />
		</ThemeProvider>
	);
}
