import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDChatUI from "@/components/chat/DnDChatUI";
import DnDGamemasterGameCP from "@/components/gamemaster/DnDGamemasterGameCP";
import {
    useChats,
    useGame,
    useGameUsers,
    useLoginData,
    useTick,
} from "@/utils/customHooks";
import { sendChat } from "@/utils/game";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 *
 * @returns Site to Show a Character
 */
export default function GameMaster() {
    const router = useRouter();
    var id: any = router.query.id;
    const [error, setError] = useState("");

    const { loggedIn, ready, user } = useLoginData("gamemaster");

    const [open, setOpen] = useState(false);
    const { tick, updateTick } = useTick(5, open);

    const chats = useChats(id, tick);

    const users = useGameUsers(id);
    const game = useGame(id, tick);

    if (!ready) {
        return (
            <DnDDefaultPage
                error={error}
                setError={setError}
                children={
                    <>
                        <Typography>Loading....</Typography>
                    </>
                }
                user={user}
                navBar={false}
            ></DnDDefaultPage>
        );
    }
    if ((ready && !loggedIn) || (ready && !user)) {
        window.location.href = "/";
        return <></>;
    }

    if (!game) {
        return (
            <DnDDefaultPage
                error={error}
                setError={setError}
                children={
                    <>
                        <Typography>Loading....</Typography>
                    </>
                }
                user={user}
                navBar={false}
            ></DnDDefaultPage>
        );
    }

    return (
        <DnDDefaultPage error={error} setError={setError} navBar user={user}>
            <DnDGamemasterGameCP
                game={game}
                id={id}
                updateTick={updateTick}
                tick={tick}
                open={open}
                setOpen={setOpen}
                user={user}
            ></DnDGamemasterGameCP>
            <DnDChatUI
                chats={chats}
                user={user.user}
                sendMessage={(text, to) => {
                    sendChat(id, {
                        date: new Date(),
                        from: "",
                        message: text,
                        to: to,
                        type: "chat",
                    });
                }}
                addresses={users}
            ></DnDChatUI>
        </DnDDefaultPage>
    );
}
