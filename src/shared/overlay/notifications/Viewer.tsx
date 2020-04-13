import { css } from "@emotion/core";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { theme } from "../theme";

export function ViewerNotifications() {
  const { ["user-id"]: userId } = useRouter().query;

  const [notificationQueue, setNotificationQueue] = useState<
    { key: string; content: ReactNode }[]
  >([]);

  const [currentNotification, setCurrentNotification] = useState<{
    key: string;
    content: ReactNode;
  } | null>(null);

  const pullNewNotificationFromQueueRef = useRef(() => {});

  useEffect(() => {
    pullNewNotificationFromQueueRef.current = function internalPullNewNotification() {
      if (currentNotification) return;

      const [first, ...remaining] = notificationQueue;
      if (!first) return;

      setNotificationQueue(remaining);

      setCurrentNotification(first);

      setTimeout(() => {
        setCurrentNotification((c) => null);
        pullNewNotificationFromQueueRef.current();
      }, 5000);
    };
  });

  useEffect(() => {
    let viewerSet = new Set<string>();

    async function getViewers() {
      const data = await fetch(`/api/${userId}/twitch/viewers`).then((x) =>
        x.json()
      );
      const newViewers = new Set<string>();
      Object.keys(data).forEach((viewerCategory) => {
        const viewersOfCategory = data[viewerCategory] as string[];
        viewersOfCategory.forEach((viewer) => {
          if (!viewerSet.has(viewer)) {
            setNotificationQueue((q) => [
              ...q,
              {
                key: viewer,
                content: (
                  <span>
                    Hello <strong>{viewer}</strong>! Welcome to the stream!
                  </span>
                ),
              },
            ]);

            viewerSet.add(viewer);
          }
          newViewers.add(viewer);
        });
      });
      viewerSet = newViewers;

      setTimeout(() => {
        pullNewNotificationFromQueueRef.current();
      }, 0);
    }

    getViewers();

    const interval = setInterval(() => {
      getViewers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!currentNotification) return null;

  return (
    <Notification
      content={currentNotification?.content}
      key={currentNotification?.key}
    />
  );
}

function Notification(props: { content: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeoutA = setTimeout(() => {
      setVisible(true);
    }, 500);

    const timeoutB = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => {
      clearTimeout(timeoutA);
      clearTimeout(timeoutB);
    };
  }, []);

  if (!props.content) return null;

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
        transform: translate(${visible ? "0px" : "-200%"}, 0px);
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
        {props.content}
      </p>
    </div>
  );
}
