import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDNPCCP from "@/components/npc/DnDNPCCP";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";

/**
 * @permission GAMEMASTER
 * @returns Dashboard, Currently without FUNCTION
 */
export default function NPC() {
  const { loggedIn, ready, user } = useLoginData("gamemaster");
  const [error, setError] = useState("");

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

  return (
    <DnDDefaultPage
      error={error}
      setError={setError}
      user={user}
      navBar
      children={<DnDNPCCP></DnDNPCCP>}
    />
  );
}
