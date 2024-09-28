import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDCharacterCreator from "@/components/character/DnDCharacterCreator";
import { getSideBarWidth } from "@/utils/constants";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

/**
 * @permission USER
 * @returns Creates a Character with Questions
 */
export default function CharacterCreator() {
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

  const saveCharacter = async (character: any) => {
    const response = await axios.post("/api/character/addCharacter", {
      character: character,
    });
    if (!response.data.error) {
      window.location.href = "/ownCharacters";
    }
  };

  return (
    <DnDDefaultPage user={user} navBar error={error} setError={setError}>
      <DnDCharacterCreator
        character={undefined}
        onSave={saveCharacter}
      ></DnDCharacterCreator>
    </DnDDefaultPage>
  );
}
