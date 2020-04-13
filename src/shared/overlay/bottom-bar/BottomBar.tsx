import { css, jsx } from "@emotion/core";
import { Spacer } from "../Spacer";
import { Clock } from "./elements/Clock";
import { Socials } from "./elements/Socials";
import { SpotifySong } from "./elements/SpotifySong";
import { TwitchFollowers } from "./elements/TwitchFollowers";
import { Marquee } from "./Marquee";

export function BottomBar() {
  return (
    <div css={styles}>
      <Socials css={{ flex: "0 0 auto" }} />
      <Marquee
        durationInMs={10 * 1000}
        css={{
          flex: "1 1 auto",
          margin: "0 2em",
        }}
      >
        <SpotifySong />
        <Spacer width="3em" />
        <TwitchFollowers />
        <Spacer width="3em" />
      </Marquee>
      <Clock css={{ flex: "0 0 auto" }} />
    </div>
  );
}

const styles = css`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3em;
  display: flex;
  align-items: center;
  color: white;
  padding: 0 2em;
  justify-content: space-between;
  font-size: 1.4em;
`;
