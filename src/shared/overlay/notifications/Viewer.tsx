import { useRouter } from "next/router";
import { useEffect } from "react";
import { useNotify } from "./NotificationQueue";

const viewerWavUrl = "/viewer.wav";

export function ViewerNotifications() {
  const { ["user-id"]: userId } = useRouter().query;

  const notify = useNotify();

  useEffect(() => {
    let viewerSet = new Set<string>();

    async function getViewers() {
      const data = await fetch(
        `/api/${userId}/twitch/viewers`
      ).then((x) => x.json());
      const newViewers = new Set<string>();
      Object.keys(data).forEach((viewerCategory) => {
        const viewersOfCategory = data[
          viewerCategory
        ] as string[];
        viewersOfCategory.forEach((viewer) => {
          if (!viewerSet.has(viewer)) {
            notify({
              key: viewer,
              content: (
                <span>
                  Hello <strong>{viewer}</strong>! Welcome
                  to the stream!
                </span>
              ),
              soundEffectUrl: viewerWavUrl,
            });

            viewerSet.add(viewer);
          }
          newViewers.add(viewer);
        });
      });
      viewerSet = newViewers;
    }

    getViewers();

    const interval = setInterval(() => {
      getViewers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
