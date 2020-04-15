import { useCallback, useReducer } from "react";

export function useForceUpdate() {
  const [i, dispatch] = useReducer((i) => i + 1, 0);

  const forceUpdate = useCallback(() => {
    dispatch();
  }, []);

  return forceUpdate;
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
