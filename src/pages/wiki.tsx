import { GetServerSideProps } from 'next';
import Link from 'next/link';
import prisma from '@/utils/prisma';
import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import { useEditor, useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";
import WikiPage from '@/components/wiki/WikiPage';

export default function Wiki() {
    const { loggedIn, ready, user } = useLoginData("user");
    const [error, setError] = useState("");
    const { _ready, isEditor } = useEditor()
    if (!ready && !_ready) {
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

    return (
        <DnDDefaultPage
            error={error}
            setError={setError}
            user={user}
            navBar
            children={<WikiPage ></WikiPage>}
        />
    );
}