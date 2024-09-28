import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import { DnDNewsCP } from "@/components/news/DnDNewsCP";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";

/**
 * @permission ADMIN
 * @returns Dashboard, Currently without FUNCTION
 */
export default function News() {
  const { loggedIn, ready, user } = useLoginData("admin");
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
      children={<DnDNewsCP edit></DnDNewsCP>}
    />
  );
}
