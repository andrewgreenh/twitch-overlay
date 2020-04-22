import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useForceUpdate } from "../../utils";
import { Notification } from "./Notification";

export function NotificationQueue(props: {
  children: ReactNode;
  silent?: boolean;
}) {
  const forceUpdate = useForceUpdate();

  const queueRef = useRef([] as Notification[]);

  const currentNotificationRef = useRef(
    null as null | Notification
  );

  const currentNotification =
    currentNotificationRef.current;

  const pullNewNotificationFromQueueRef = useCallback(() => {
    if (currentNotificationRef.current !== null) return;
    const first = queueRef.current[0];
    if (!first) return;

    currentNotificationRef.current = first;
    queueRef.current.shift();

    forceUpdate();
    setTimeout(() => {
      currentNotificationRef.current = null;
      pullNewNotificationFromQueueRef();

      forceUpdate();
    }, 5000);
  }, []);

  const contextValue = useMemo(
    () => ({
      notify: (n: Notification) => {
        queueRef.current.push(n);
        pullNewNotificationFromQueueRef();
      },
    }),
    []
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {props.children}
      {currentNotification && (
        <Notification
          key={currentNotification.key}
          notification={currentNotification}
          silent={props.silent}
        />
      )}
    </NotificationContext.Provider>
  );
}

const NotificationContext = createContext(
  null as null | {
    notify: (notification: Notification) => void;
  }
);

export function useNotify() {
  const notify = useContext(NotificationContext)?.notify;

  if (!notify)
    throw new Error(
      "Only use useNotify within a NotificationQueue"
    );

  return notify;
}
