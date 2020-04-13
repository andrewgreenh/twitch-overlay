import { jsx } from "@emotion/core";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentProps } from "react";

export function Socials(props: ComponentProps<"div">) {
  return (
    <div {...props}>
      <FontAwesomeIcon icon={faTwitter} /> @andrewgreenh
    </div>
  );
}
