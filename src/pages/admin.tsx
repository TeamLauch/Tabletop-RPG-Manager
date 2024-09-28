import DnDAdminPage from "@/components/admin/DnDAdminPage";
import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
import { useLoginData } from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useState } from "react";

/**
 * @permission ADMIN
 * @returns Site to Manage Users
 */
export default function Users() {
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
      children={
        <>
          <DnDAdminPage></DnDAdminPage>
        </>
      }
      user={user}
      navBar={true}
    ></DnDDefaultPage>
  );
}
