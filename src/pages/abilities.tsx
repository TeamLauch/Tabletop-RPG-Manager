import DnDAbilitiesList from "@/components/abilites/DnDAbilitiesList";
import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";

/**
 * @permission EDITOR
 * @returns Site to Manage Abilites
 */
export default function Abilities() {
  const { loggedIn, ready, user } = useLoginData("editor");
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
      children={<DnDAbilitiesList setError={setError}></DnDAbilitiesList>}
    />
  );
}
