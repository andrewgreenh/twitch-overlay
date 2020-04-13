import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export function StatusChecker(props: {
  init: (phase: "mount" | "click") => Promise<boolean>;
}) {
  const [state, setState] = useState<"offline" | "online" | "checking">(
    "offline"
  );

  async function check(phase: "mount" | "click") {
    setState("checking");
    try {
      const result = await props.init(phase);
      if (result) setState("online");
      else setState("offline");
    } catch (err) {
      console.error(err);
      setState("offline");
    }
  }

  useEffect(() => {
    check("mount");
  }, []);

  return (
    <button
      css={{
        background: "white",
        color: state === "offline" ? "red" : "green",
        border: 0,
        padding: "0.2em 0.5em",
        position: "relative",
      }}
      onClick={() => check("click")}
    >
      <span
        css={{
          visibility: state === "checking" ? "hidden" : "visible",
        }}
      >
        {state}
      </span>
      <span
        css={{
          visibility: state !== "checking" ? "hidden" : "visible",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <FontAwesomeIcon spin icon={faSpinner} />
      </span>
    </button>
  );
}
