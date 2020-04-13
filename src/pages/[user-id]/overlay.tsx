import { useRouter } from "next/router";
import React from "react";
import { GradientBackgrounds } from "../../shared/overlay/borders/GradientBackgrounds";
import { BottomBar } from "../../shared/overlay/bottom-bar/BottomBar";
import { ViewerNotifications } from "../../shared/overlay/notifications/Viewer";

export function App() {
  const { ["user-id"]: userId } = useRouter().query;
  if (!userId) return null;
  return (
    <React.Fragment>
      <GradientBackgrounds />
      <BottomBar />
      <ViewerNotifications />
    </React.Fragment>
  );
}

export default App;
