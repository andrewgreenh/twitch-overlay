import { css, jsx } from "@emotion/core";
import { ComponentProps, useEffect, useState } from "react";

export function Clock(props: ComponentProps<"div">) {
  const [now, setNow] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const pad = (s: number) => (s + "").padStart(2, "0");
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      setNow(`${hours}:${minutes}:${seconds}`);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div {...props} css={styles}>
      {now}
    </div>
  );
}

const styles = css``;
