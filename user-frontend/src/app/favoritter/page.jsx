"use client";
import { toast } from "react-hot-toast";

export default function Page() {
  return (
    <>
      <button onClick={() => toast.success("Produkt oprettet!")}>
        success
      </button>
      <button onClick={() => toast.error("Noget gik galt. Prøv igen.")}>
        error
      </button>
    </>
  );
}
