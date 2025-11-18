import AppProvider from "./provider";
import { AppRouter } from "./router";
import Header from "@/components/ui/header/header.tsx";

export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
