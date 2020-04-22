import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useNotify } from "./NotificationQueue";

const followerUrl = "/follower.wav";

export function TwitchFollowersNotification() {
  const { ["user-id"]: userId } = useRouter().query;

  const [lastFollower, setLastFollower] = useState(
    null as string | null
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch(
        `/api/${userId}/twitch/followers`
      );
      if (cancelled) return;
      const data = await response.json();
      const lastNFollows = data.data.slice(0, 3);

      const lastFollow = lastNFollows?.[0];

      setLastFollower(lastFollow.from_name);
    }
    const interval = setInterval(load, 10000);

    load();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const notify = useNotify();

  useEffect(() => {
    if (!lastFollower) return;
    notify({
      content: (
        <span>
          Thanks for the follow,{" "}
          <strong>{lastFollower}</strong>
        </span>
      ),
      key: lastFollower,
      soundEffectUrl: followerUrl,
    });
  }, [lastFollower]);

  return null;
}
