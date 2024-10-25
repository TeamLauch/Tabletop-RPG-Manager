import { GameChat } from "@/utils/types";
import React, { useState, useEffect } from "react";
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
    Badge,
    Box,
    TextField,
    Autocomplete,
    Chip,
    Paper,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { styled } from "@mui/material/styles";
import { type } from "os";
// Material-UI Drawer style
const StyledDrawer = styled(Drawer)({
    "& .MuiDrawer-paper": {
        width: 400,
        backgroundColor: "#f9f9f9",
    },
});

type AddressOption = string | { id: string; name: string };

export default function DnDChatUI({
    chats,
    sendMessage,
    addresses,
    user,
}: {
    chats: GameChat[];
    sendMessage: (text: string, to: string[]) => void;
    addresses: AddressOption[];
    user: string;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [newMessage, setNewMessage] = useState<string>("");

    const openSidebarOnHover = (event: MouseEvent) => {
        if (event.clientX < 10) {
            setSidebarOpen(true);
        }
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", openSidebarOnHover);
        return () =>
            window.removeEventListener("mousemove", openSidebarOnHover);
    }, [chats]);

    const handleSendMessage = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" && newMessage.trim()) {
            sendMessage(newMessage.trim(), selectedRecipients);
            setNewMessage("");
        }
    };
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

    const formatAddressOption = (option: AddressOption, type: "id" | "name") =>
        typeof option === "string" ? option : option[type];

    return (
        <>
            <StyledDrawer
                anchor="left"
                open={isSidebarOpen}
                onClose={closeSidebar}
                variant="temporary"
            >
                <Box
                    p={2}
                    width={"90%"}
                    display="flex"
                    flexDirection="column"
                    height="96%"
                >
                    <Typography variant="h6" gutterBottom>
                        Chat
                    </Typography>

                    {/* Scrollable message list */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            mb: 2,
                            maxHeight: "80%",
                        }}
                    >
                        <List sx={{ flexGrow: 1, overflow: "auto" }}>
                            {chats.map((message) => (
                                <ListItem
                                    key={message.date + ""}
                                    divider
                                    sx={{
                                        justifyContent:
                                            message.from == user
                                                ? "flex-end"
                                                : "flex-start",
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            p: 1,
                                            backgroundColor:
                                                message.from == user
                                                    ? "#e0f7fa"
                                                    : "#f1f1f1",
                                            minWidth: "70%",
                                            maxWidth: "80%",
                                        }}
                                    >
                                        <ListItemText
                                            primary={message.message}
                                            secondary={
                                                message.from != user
                                                    ? message.from
                                                    : "ich"
                                            }
                                            sx={{
                                                textAlign:
                                                    message.from == user
                                                        ? "right"
                                                        : "left",
                                            }}
                                        />
                                    </Paper>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Autocomplete
                        multiple
                        options={addresses}
                        getOptionLabel={(option) =>
                            formatAddressOption(option, "name")
                        }
                        onChange={(_, value) =>
                            setSelectedRecipients(
                                value.map((option) =>
                                    typeof option === "string"
                                        ? option
                                        : option.id
                                )
                            )
                        }
                        disableCloseOnSelect
                        isOptionEqualToValue={(option, value) => {
                            if (
                                typeof option == "string" ||
                                typeof value == "string"
                            ) {
                                return option == value;
                            }
                            return option.id == value.id;
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Empfänger auswählen"
                            />
                        )}
                        value={addresses.filter((addr) =>
                            selectedRecipients.includes(
                                formatAddressOption(addr, "id")
                            )
                        )}
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
                                <Chip
                                    key={index + "naufcni"}
                                    label={formatAddressOption(option, "name")}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        label="Nachricht schreiben"
                        variant="outlined"
                        fullWidth
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleSendMessage}
                    />
                </Box>
            </StyledDrawer>
        </>
    );
}
