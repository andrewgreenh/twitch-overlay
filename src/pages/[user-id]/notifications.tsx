import { css, Global } from "@emotion/core";
import { useRouter } from "next/router";
import React from "react";
import { NotificationQueue } from "../../shared/overlay/notifications/NotificationQueue";
import { TwitchFollowersNotification } from "../../shared/overlay/notifications/TwitchFollowers";

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
      {/* <ViewerNotifications /> */}
      <TwitchFollowersNotification />
    </NotificationQueue>
  );
}

export default App;
