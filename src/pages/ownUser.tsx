import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDChangePassword from "@/components/user/DnDChangePassword";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

/**
 * @permission USER
 * @returns Dashboard, Currently without FUNCTION
 */
export default function Dashboard() {
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
        <DnDChangePassword
          oldPW
          cancel={() => {
            window.location.href = "/";
          }}
          handleSave={async (password: any, oldPassword: any) => {
            try {
              await axios.post("/api/user/updatePW", {
                password: password,
                oldPassword: oldPassword,
              });
              window.location.href = "/";
            } catch (error) {
              setError("Ungültiges Passwort");
            }
          }}
          err={error}
        ></DnDChangePassword>
      }
    />
  );
}
