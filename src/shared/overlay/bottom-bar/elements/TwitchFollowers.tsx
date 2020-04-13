import { css } from "@emotion/core";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function TwitchFollowers() {
  const { ["user-id"]: userId } = useRouter().query;

  const [state, setState] = useState({
    state: "fetching" as "fetching" | "error" | "done",
    errorText: null as string | null,
    data: null as any,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(`/api/${userId}/twitch/followers`);
        if (cancelled) return;
        const data = await response.json();
        setState({
          state: "done",
          errorText: null,
          data: data,
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          state: "error",
          errorText: String(err),
          data: null,
        });
      }
    }
    const interval = setInterval(load, 10000);

    load();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (state.state === "fetching") return null;

  const lastNFollowers = state.data.data.slice(0, 3);
  return (
    <div css={css({ flex: "0 0 auto", whiteSpace: "nowrap" })}>
      <FontAwesomeIcon icon={faTwitch} /> <span>Last followers: </span>
      {state.state === "error"
        ? state.errorText
        : lastNFollowers.map((followInfo: any) => (
            <span key={followInfo.from_id}>{followInfo.from_name} </span>
          ))}
    </div>
  );
}
