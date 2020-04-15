import { css } from "@emotion/core";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useState } from "react";
import { theme } from "../theme";

export function Notification(props: {
  notification: Notification;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const audioElement = props.notification.soundEffectUrl
      ? new Audio(props.notification.soundEffectUrl)
      : null;

    const timeoutA = setTimeout(() => {
      setVisible(true);
      audioElement?.play();
    }, 500);

    const timeoutB = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => {
      clearTimeout(timeoutA);
      clearTimeout(timeoutB);
    };
  }, []);

  if (!props.notification.content) return null;

  return (
    <div
      css={css`
        position: fixed;
        top: 200px;
        left: 100px;
        background: ${theme.colors.dark};
        color: white;
        border-radius: 3em;
        strong {
          font-weight: 700;
        }
        display: flex;
        align-items: center;
        font-size: 2em;
        transition: transform 0.5s ease-in-out;
        transform: translate(
          ${visible ? "0px" : "-200%"},
          0px
        );
        border: 5px solid white;
        box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
      `}
    >
      <div
        css={css`
          width: 2em;
          height: 2em;
          border: 5px solid ${theme.colors.accent};
          border-radius: 3em;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2em;
          color: white;
        `}
      >
        <FontAwesomeIcon icon={faHeart} />
      </div>
      <p
        css={css`
          align-self: center;
          padding: 0.5em 1em 0.5em 1em;
        `}
      >
        {props.notification.content}
      </p>
    </div>
  );
}

export type Notification = {
  key: string;
  content: ReactNode;
  soundEffectUrl?: string;
};
