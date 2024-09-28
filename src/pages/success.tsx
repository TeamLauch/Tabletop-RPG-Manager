import DnDDefaultPage from "@/components/basic/DnDDefaultPage";

export default function success() {
  return (
    <DnDDefaultPage
      user={undefined}
      navBar={false}
      error={undefined}
      setError={undefined}
    >
      <h1>
        Bitte überprüfe dein Emailpostfach auf eine Mail mit einem neuen
        Passwort
      </h1>
      <button onClick={() => (window.location.href = "/")}>
        Zurück zur loginseite
      </button>
    </DnDDefaultPage>
  );
}
