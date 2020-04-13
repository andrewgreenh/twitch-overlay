import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function SpotifySong() {
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
        const response = await fetch(
          `/api/${userId}/spotify/currently-playing`
        );
        if (cancelled) return;
        if (response.status === 204) {
          setState({
            state: "error",
            data: null,
            errorText: "No song playing right now.",
          });
        } else {
          const data = await response.json();
          setState({
            state: "done",
            errorText: null,
            data: data,
          });
        }
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

  const duration = state.data?.item?.duration_ms ?? 0;
  const minutes = Math.floor(duration / 1000 / 60);
  const seconds = Math.floor(duration / 1000) % 60;
  const formattedDuration = !duration
    ? ""
    : `(${minutes}:${seconds.toString().padStart(2, "0")})`;

  return (
    <div>
      <FontAwesomeIcon icon={faSpotify} />{" "}
      {state.state === "error" ? (
        state.errorText
      ) : (
        <span>
          {state.data.item.name} {formattedDuration} by{" "}
          {state.data.item.artists[0]?.name ?? "Unknown"}
        </span>
      )}
    </div>
  );
}
