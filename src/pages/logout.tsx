import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DnDDefaultPage from "@/components/basic/DnDDefaultPage";
/**
 *
 * @returns Logout Page -> Just deletes Cookie from Database
 */
function LogoutPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (router.isReady) {
      fetch("/api/user/logout");
      setReady(true);
    }
  }, [router]);

  if (ready) {
    router.push("/");
    return <></>;
  }

  if (!ready) {
    return (
      <DnDDefaultPage
        error={error}
        setError={setError}
        user={null}
        children={<Typography>Logging out....</Typography>}
        navBar={false}
      />
    );
  }
  return (
    <DnDDefaultPage
      error={error}
      setError={setError}
      user={null}
      children={<Typography>Logging out....</Typography>}
      navBar={false}
    />
  );
}

export default LogoutPage;
