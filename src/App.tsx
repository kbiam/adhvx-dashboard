import "react-toastify/dist/ReactToastify.css";
import { AppRoutes } from "./route";
import { ToastContainer } from "react-toastify";
import { dataService } from "./dataservice";
import { useAccountStore } from "./store/account.store";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./custom_components/theme_provider";

function App() {
  const [loading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  useEffect(() => {
    async function fetchAccountDetails() {
      try {
        const accountData = await dataService.get("/api/info");
        if (accountData) {
          useAccountStore.setState(accountData);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchAccountDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  // if (isError) {
  //   return <div>Invalid Account</div>;
  // }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="scifi-ui-theme">
      <AppRoutes />
      <ToastContainer theme="dark" />
    </ThemeProvider>
  );
}

export default App;
