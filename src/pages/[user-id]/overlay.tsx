import { css, Global } from "@emotion/core";
import { useRouter } from "next/router";
import React from "react";
import { GradientBackgrounds } from "../../shared/overlay/borders/GradientBackgrounds";
import { BottomBar } from "../../shared/overlay/bottom-bar/BottomBar";
import { NotificationQueue } from "../../shared/overlay/notifications/NotificationQueue";
import { ViewerNotifications } from "../../shared/overlay/notifications/Viewer";

export function App() {
  const { ["user-id"]: userId } = useRouter().query;
  if (!userId) return null;
  return (
    <NotificationQueue>
      <Global
        styles={css`
          html {
            background: transparent;
          }
        `}
      />
      <GradientBackgrounds />
      <BottomBar />
      <ViewerNotifications />
    </NotificationQueue>
  );
}

export default App;
