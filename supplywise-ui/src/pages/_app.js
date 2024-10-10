import { useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/supplywise.css"

export default function App({ Component, pageProps }) {

  useEffect(() => {
    if (typeof document !== "undefined") {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return <Component {...pageProps} />;
}
