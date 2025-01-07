import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { SidebarProvider } from "./components/ui/sidebar";
import { AISpeechProvider } from "./contexts/ai-speech-context";
import { AuthProvider } from "./contexts/auth-context";
import { WebsocketProvider } from "./contexts/websocket-context";
import "./i18n/i18n";
import "./index.css";
import router from "./router/router";

const App = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <WebsocketProvider>
          <AISpeechProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <RouterProvider router={router} />
            </ThemeProvider>
          </AISpeechProvider>
        </WebsocketProvider>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default App;
