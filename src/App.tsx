import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { DemoProvider } from "./state/DemoContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </DemoProvider>
    </BrowserRouter>
  );
}

export default App;
