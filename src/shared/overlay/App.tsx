import { jsx } from "@emotion/core";
import React from "react";
import { GradientBackgrounds } from "./borders/GradientBackgrounds";
import { BottomBar } from "./bottom-bar/BottomBar";
import { ViewerNotifications } from "./notifications/Viewer";

export function App() {
  return (
    <React.Fragment>
      <GradientBackgrounds />
      <BottomBar />
      <ViewerNotifications />
    </React.Fragment>
  );
}
