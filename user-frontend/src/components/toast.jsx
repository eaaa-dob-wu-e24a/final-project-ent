"use client";

import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          className: "",
          duration: 3000,
          style: {
            color: "#fff",
            borderRadius: "10px",
            font: "16px 'Synonym', sans-serif",
            fontWeight: "600",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
            marginBottom: "1rem",
          },
          success: {
            duration: 3000,
            style: {
              background: "#5BAD86",
            },
            icon: "🎉",
          },
          error: {
            duration: 3000,
            style: {
              background: "#FF5747",
            },
            icon: "❌",
          },
        }}
      />
    </>
  );
}
