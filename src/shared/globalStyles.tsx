import { css, Global } from "@emotion/core";

export const globalStyles = (
  <Global
    styles={css`
      html {
        font-family: "Roboto Mono", monospace;
        background: #20274f;
        color: white;
      }

      * {
        box-sizing: border-box;
        font: inherit;
        padding: 0;
        margin: 0;
      }

      html,
      body,
      #__next {
        height: 100%;
        overflow: hidden;
      }
    `}
  />
);
