import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "@mui/material";
import { getRoles } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

const settings = [
	{
		name: "Benutzereinstellungen",
		link: "/userSettings",
	},
	{
		name: "Logout",
		link: "/logout",
	},
];

const menus: { name: string; role: string; link: string }[] = [
	{
		name: "Benutzer",
		link: "/user",
		role: "admin",
	},
	{
		name: "News",
		link: "/news",
		role: "admin",
	},
	{
		name: "Admin",
		link: "/admin",
		role: "admin",
	},
	{
		name: "Zauber",
		link: "/zauber",
		role: "user",
	},
	{
		name: "Fähigkeiten",
		link: "/abilities",
		role: "editor",
	},
	{
		name: "NPCs",
		link: "/npc",
		role: "gamemaster",
	},
	{
		name: "Items",
		link: "/items",
		role: "gamemaster",
	},
	{
		name: "Charaktere",
		link: "/characters",
		role: "gamemaster",
	},
	{
		name: "Eigene Charaktere",
		link: "/ownCharacters",
		role: "user",
	},
	{
		name: "Welten",
		link: "/world",
		role: "gamemaster",
	},
	{
		name: "Spiele",
		link: "/games",
		role: "user",
	},
	{
		name: "Wiki",
		link: "/wiki",
		role: "user",
	},
];

export default function DnDNavBar({ user }: { user: any }) {
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const [roles, setPermissions] = useState<any[]>([]);

	const pages = useMemo(() => {
		let pages = [];
		for (let menu of menus) {
			if (roles.includes(menu.role)) {
				pages.push(menu);
			}
		}
		return pages;
	}, [roles]);

	//check user permissions
	useEffect(() => {
		async function fetchPermissions() {
			const res = await axios.get("/api/role/getRoles");
			setPermissions(getRoles(res.data.roles));
		}
		fetchPermissions();
	}, [user]);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position="static">
			<Container maxWidth={false}>
				<Toolbar disableGutters>
					<Link href="/">
						<img src="/Logo.png" height={"50px"} />
					</Link>
					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{ display: { xs: "block", md: "none" } }}
						>
							{pages.map((page) => (
								<MenuItem
									key={page.name}
									onClick={(e) => {
										window.location.href = page.link;
									}}
								>
									<Typography sx={{ textAlign: "center" }}>
										{page.name}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						{pages.map((page) => (
							<Button
								key={page.name}
								onClick={(e) => {
									window.location.href = page.link;
								}}
								sx={{ my: 2, color: "white", display: "block" }}
							>
								{page.name}
							</Button>
						))}
					</Box>
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt={user.username} />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem
									key={setting.name}
									onClick={() => {
										window.location.href = setting.link;
									}}
								>
									<Typography sx={{ textAlign: "center" }}>
										{setting.name}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
