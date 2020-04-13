import { ComponentType } from "react";
import { globalStyles } from "../shared/globalStyles";

function App(props: { Component: ComponentType; pageProps: any }) {
  return (
    <>
      {globalStyles}
      <props.Component {...props.pageProps} />
    </>
  );
}

export default App;
