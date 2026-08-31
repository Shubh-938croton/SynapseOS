import AppRoutes from "./routes/AppRoutes";
import { SettingsProvider } from "./context/SettingsContext";
import "./styles/theme.css";

function App() {
    return (
        <SettingsProvider>
            <AppRoutes />
        </SettingsProvider>
    );
}

export default App;