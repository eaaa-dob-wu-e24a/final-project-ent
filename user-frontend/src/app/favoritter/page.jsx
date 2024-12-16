"use client";
import { toast } from "react-hot-toast";

// page content coming soon, now just a test of toast messages

export default function Page() {
  return (
    <>
      <h1>Coming soon</h1>
      <button onClick={() => toast.success("Produkt oprettet!")}>
        success
      </button>
      <button onClick={() => toast.error("Noget gik galt. Prøv igen.")}>
        error
      </button>
    </>
  );
}
