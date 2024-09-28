import Typography from "@mui/material/Typography";
import { Divider, Paper } from "@mui/material";

/**
 *
 * @returns The Footer of All Sites
 */
export function DnDFooter() {
	return (
		<Paper
			sx={{
				textAlign: "center",
				marginTop: 2,
				background: "rgba(255,255,255,.1)",
			}}
		>
			<Divider />
			<Typography sx={{ padding: 2 }}>
				&copy; {new Date().getFullYear()} DnD System. Alle Rechte vorbehalten.{" "}
				{/**<Link href="/datenschutzerklaerung"  color="rgba(0,0,0,1)" underline="none">
            Datenschutz
          </Link>{' '}
          <Link href="/impressum" color="rgba(0,0,0,1) " underline="none">
            Impressum
        </Link>*/}
			</Typography>
		</Paper>
	);
}
