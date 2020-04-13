import { css } from "@emotion/core";
import { faSpotify, faTwitch } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { StatusChecker } from "../../shared/StatusChecker";

export function App() {
  const { ["user-id"]: userId } = useRouter().query;
  if (!userId) return null;
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <table css={tableStyles}>
        <tbody>
          <tr>
            <td>
              <FontAwesomeIcon icon={faSpotify} /> Spotify
            </td>
            <td>
              <StatusChecker
                init={async (phase) => {
                  const response = await fetch(
                    `/api/${userId}/spotify/verify`,
                    {
                      redirect: "manual",
                    }
                  );
                  if (!response.ok && phase === "click") {
                    location.pathname = `/api/${userId}/spotify/login`;
                  }
                  return response.ok;
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <FontAwesomeIcon icon={faTwitch} /> Twitch
            </td>
            <td>
              <StatusChecker
                init={async (phase) => {
                  const response = await fetch(`/api/${userId}/twitch/verify`, {
                    redirect: "manual",
                  });
                  if (!response.ok && phase === "click") {
                    location.pathname = `/api/${userId}/twitch/login`;
                  }
                  return response.ok;
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const tableStyles = css`
  td {
    padding: 0.5em 1em;
  }
`;

export default App;
