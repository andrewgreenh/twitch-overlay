import { css, jsx } from "@emotion/core";
import {
  ComponentProps,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export function Marquee(
  props: {
    durationInMs: number;
    children: ReactNode[];
  } & Omit<ComponentProps<"div">, "children">
) {
  const { durationInMs, children, ...rest } = props;
  const [
    contentBiggerThanContainer,
    setContentBiggerThanContainer,
  ] = useState(true);

  useEffect(() => {
    const container = containerRef.current!;

    function loop() {
      frame = requestAnimationFrame(loop);
      const firstChild = container.children[0];

      setContentBiggerThanContainer(
        container.clientWidth < firstChild.clientWidth
      );
    }

    let frame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!contentBiggerThanContainer) return;
    const container = containerRef.current!;

    let i = 0;
    function loop() {
      frame = requestAnimationFrame(loop);
      i++;
      const milliseconds = (i / 60) * 1000;
      const ratio =
        ((milliseconds % durationInMs) / durationInMs) *
        100;

      for (const child of container.childNodes) {
        if (!(child instanceof HTMLElement)) continue;
        child.style.transform = `translate3d(${-ratio}%, 0, 0)`;
      }
    }

    let frame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame);
  }, [durationInMs, contentBiggerThanContainer]);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrappedChildren = children.map((child, index) => (
    <div className="_child-wrapper" key={index}>
      {child}
    </div>
  ));
  return (
    <div {...rest} ref={containerRef} css={styles}>
      <div className="_children-wrapper">
        {wrappedChildren}
      </div>
      {contentBiggerThanContainer && (
        <div className="_children-wrapper">
          {wrappedChildren}
        </div>
      )}
    </div>
  );
}

const styles = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;

  ._children-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex: 0 0 auto;
    padding: 0 0.2em;
  }

  .child-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
