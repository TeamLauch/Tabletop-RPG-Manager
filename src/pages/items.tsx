import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDItemCP from "@/components/items/DnDItemsCP";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";

/**
 * @permission USER
 * @returns Dashboard, Currently without FUNCTION
 */
export default function Dashboard() {
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
      children={<DnDItemCP setError={setError}></DnDItemCP>}
    />
  );
}
