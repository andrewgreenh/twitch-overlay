import { css, Global } from "@emotion/core";
import { useRouter } from "next/router";
import React from "react";
import { BottomBar } from "../../shared/overlay/bottom-bar/BottomBar";

export function App() {
  const { ["user-id"]: userId } = useRouter().query;
  if (!userId) return null;
  return (
    <>
      <Global
        styles={css`
          html {
            background: transparent;
          }
        `}
      />
      <BottomBar />
    </>
  );
}

export default App;
