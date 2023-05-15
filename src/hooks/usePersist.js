// internal imports
import { useState, useEffect } from "react";

// The usePersist hook is used to store and retrieve a boolean value from local storage and update it whenever the value changes.
const usePersist = () => {
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  // update local storage whenever persist changes
  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};

export default usePersist;
