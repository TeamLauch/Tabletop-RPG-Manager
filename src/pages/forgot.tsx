import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import DnDResetPasswordCP from "@/components/user/DnDResetPasswordCP";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Forgot() {
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
  if (ready && loggedIn) {
    window.location.href = "/";
    return <></>;
  }

  return (
    <DnDDefaultPage
      error={error}
      setError={setError}
      user={user}
      children={
        <DnDResetPasswordCP
          cancel={() => {
            window.location.href = "/";
          }}
          handleSave={async (username: any) => {
            try {
              await axios.post("/api/user/resetPW", { username: username });
              window.location.href = "/";
            } catch (error) {
              setError("ein fehler ist aufgetreten");
            }
          }}
          err={error}
        ></DnDResetPasswordCP>
      }
      navBar={false}
    />
  );
}
