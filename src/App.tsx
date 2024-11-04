import "./App.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { ThemeProvider } from "next-themes";

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
