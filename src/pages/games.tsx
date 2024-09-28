import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import { DnDGameCP } from "@/components/game/DnDGameCP";
import { useAdmin, useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";

/**
 * @permission ADMIN
 * @returns Site to Edit and Manage all Characters
 */
export default function Character() {

  const { loggedIn, ready, user }: any = useLoginData("user");
  const { _ready, isAdmin }: any = useAdmin();
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
  if (ready && !loggedIn || ready && !user) {
    window.location.href = "/";
    return <></>
  }


  return (
    <DnDDefaultPage
      error={error}
      setError={setError}
      user={user}
      navBar
      children={<DnDGameCP isAdmin={isAdmin} username={user.user}></DnDGameCP>}
    />
  );
}
