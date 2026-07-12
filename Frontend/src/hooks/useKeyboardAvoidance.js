import { useEffect } from "react";

export default function useKeyboardAvoidance(ref) {
  useEffect(() => {
    if (!ref?.current) return;

    const handleFocus = () => {
      setTimeout(() => {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    };

    const el = ref.current;
    el.addEventListener("focus", handleFocus);
    return () => el.removeEventListener("focus", handleFocus);
  }, [ref]);
}

