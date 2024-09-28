import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDCharacterCP from "@/components/character/DnDCharacterCP";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";

/**
 * @permission USER
 * @returns Site to to Manage Own Characters
 */
export default function OwnCharacter() {
  const { loggedIn, ready, user } = useLoginData("user");
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
        <>
          <DnDCharacterCP
            own
            setError={(e: any) => {
              setError(e);
            }}
          ></DnDCharacterCP>
        </>
      }
    />
  );
}
