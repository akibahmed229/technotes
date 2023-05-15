// internal imports
import { useEffect } from "react";

// to set the page title
const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    return () => (document.title = prevTitle); // cleanup
  }, [title]);
};

export default useTitle;
