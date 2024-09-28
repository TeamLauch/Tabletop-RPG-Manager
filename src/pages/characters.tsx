import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDCharacterCP from "@/components/character/DnDCharacterCP";
import { getSideBarWidth } from "@/utils/constants";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

/**
 * @permission ADMIN
 * @returns Site to Edit and Manage all Characters
 */
export default function Character() {
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
      children={
        <DnDCharacterCP own={false} setError={setError}></DnDCharacterCP>
      }
    />
  );
}
