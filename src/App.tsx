import "./App.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { WebsocketProvider } from "./contexts/WebsocketContext";
import router from "./router/router";

const App = () => {
  return (
    <WebsocketProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RouterProvider router={router} />
      </ThemeProvider>
    </WebsocketProvider>
  );
};

export default App;
