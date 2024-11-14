import "./App.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { WebsocketProvider } from "./contexts/WebsocketContext";
import router from "./router/router";
import { AISpeechProvider } from "./contexts/AISpeechContext";

const App = () => {
  return (
    <WebsocketProvider>
      <AISpeechProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AISpeechProvider>
    </WebsocketProvider>
  );
};

export default App;
