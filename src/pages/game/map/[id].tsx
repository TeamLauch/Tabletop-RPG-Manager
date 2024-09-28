import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import { ViewOnlyMapCP } from "@/components/map/MapComponents";
import { useActiveMap, useLoginData, useTick } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 *
 * @returns Site to Show a Character
 */
export default function GameMap() {
  const router = useRouter();
  var id: any = router.query.id;
  const [error, setError] = useState("");

  const { loggedIn, ready, user } = useLoginData("user");

  const { tick, updateTick } = useTick(3);

  const map = useActiveMap(id, tick);

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

  if (!map) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          overflow: "hidden",
        }}
      ></div>
    );
  }

  return (
    <ViewOnlyMapCP
      map={map}
      images={map.images}
      dimensions={{ x: window.innerWidth, y: window.innerHeight }}
      ts={map.tokens}
      fogOfWar={map.fogOfWar ?? { color: [0, 0, 0], visible: false }}
      grid={map.grid}
    ></ViewOnlyMapCP>
  );
}
