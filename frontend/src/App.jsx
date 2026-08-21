import AppRoutes from "./routes/AppRoutes";
import { SettingsProvider } from "./context/SettingsContext";

function App() {
    return (
        <SettingsProvider>
            <AppRoutes />
        </SettingsProvider>
    );
}

export default App;