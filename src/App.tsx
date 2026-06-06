import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { LanguageProvider } from "./i18n/LanguageContext";
import { DemoProvider } from "./state/DemoContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <DemoProvider>
          <AppShell>
            <AppRoutes />
          </AppShell>
        </DemoProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
