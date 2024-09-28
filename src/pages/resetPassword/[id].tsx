import DnDChangePassword from "@/components/user/DnDChangePassword";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 *
 * @returns Site to Level Up Character Data in a Simple view
 */
export default function ResetPassword() {
  const router = useRouter();
  var id = router.query.id;

  const [error, setError] = useState("");

  const [isTokenValid, setToken] = useState<any>(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        return;
      }
      const response = await axios.post("/api/user/checkToken", { token: id });
      if (response.data.error) {
        setReady(true);
        return;
      }
      setToken(true);
      setReady(true);
    };
    load();
  }, [id]);

  if (!ready) {
    return <div>Loading...</div>;
  }
  if (!isTokenValid) {
    window.location.href = "/";
    return <></>;
  }

  return (
    <DnDChangePassword
      oldPW={false}
      cancel={() => {
        window.location.href = "/";
      }}
      err={error}
      handleSave={async (password: any) => {
        const r = await axios.post("/api/user/tokenReset", {
          token: id,
          newPassword: password,
        });
        if (r.data.error) {
          setError(r.data.message);
          return;
        }
        window.location.href = "/";
      }}
    ></DnDChangePassword>
  );
}
