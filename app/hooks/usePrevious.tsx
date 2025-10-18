import { useEffect, useRef } from "react";

function usePrevious<C>(value: C): C | null {
  const ref = useRef<C>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
