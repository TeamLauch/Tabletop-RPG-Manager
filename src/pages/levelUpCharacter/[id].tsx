import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDCharacterCreator from "@/components/character/DnDCharacterCreator";
import { getSideBarWidth } from "@/utils/constants";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 *
 * @returns Site to Level Up Character Data in a Simple view
 */
export default function LevelUp() {
  const router = useRouter();
  var id = router.query.id;

  const { loggedIn, ready, user } = useLoginData("user");
  const [error, setError] = useState("");

  const [character, setCharacter] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      let response = await axios.post("/api/character/getCharacter", {
        id: id,
      });
      if (response.data.error) {
        setError(response.data.message);
        return;
      }
      setError("");
      setCharacter(response.data.character);
    };
    load();
  }, [id]);

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
  if (!character) {
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

  const saveCharacer = async (character: any) => {
    const response = await axios.post("/api/character/editCharacter", {
      character: character,
    });
    if (!response.data.error) {
      window.location.href = "/ownCharacters";
    }
  };

  return (
    <DnDDefaultPage navBar user={user} error={error} setError={setError}>
      <DnDCharacterCreator
        character={character}
        onSave={saveCharacer}
      ></DnDCharacterCreator>
    </DnDDefaultPage>
  );
}
