import "./App.css";
import "./index.css";
import "./i18n/i18n";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { WebsocketProvider } from "./contexts/websocket-context";
import router from "./router/router";
import { AISpeechProvider } from "./contexts/ai-speech-context";
import { AuthProvider } from "./contexts/auth-context";
import { SidebarProvider } from "./components/ui/sidebar";

const App = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <WebsocketProvider>
          <AISpeechProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <RouterProvider router={router} />
            </ThemeProvider>
          </AISpeechProvider>
        </WebsocketProvider>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default App;
