import { css, jsx } from "@emotion/core";
import { ComponentProps, CSSProperties } from "react";

export function Spacer(
  props: {
    width?: CSSProperties["width"];
    height?: CSSProperties["height"];
  } & ComponentProps<"div">
) {
  const { width, height, ...rest } = props;
  return (
    <div
      css={styles}
      style={{ width, height }}
      {...rest}
    ></div>
  );
}

const styles = css``;
