import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, type ReactNode } from "react";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  getLanguageFromPath,
  getLanguagePath,
  resolvePreferredLanguage,
  syncLanguage,
  type SupportedLanguage,
} from "./i18n";
import Home from "./pages/Home";

function RoutedPage({
  language,
  children,
}: {
  language: SupportedLanguage;
  children: ReactNode;
}) {
  useEffect(() => {
    void syncLanguage(language);
  }, [language]);

  return <>{children}</>;
}

function RootRedirect() {
  return <Redirect to={getLanguagePath(resolvePreferredLanguage())} replace />;
}

function LegacyNotFoundRedirect() {
  return <Redirect to={getLanguagePath(resolvePreferredLanguage(), "/404")} replace />;
}

function LocalizedNotFound() {
  const [location] = useLocation();
  const language = getLanguageFromPath(location) ?? resolvePreferredLanguage();

  useEffect(() => {
    void syncLanguage(language);
  }, [language]);

  return <NotFound />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={RootRedirect} />
      <Route path={"/404"} component={LegacyNotFoundRedirect} />
      <Route path={"/en"}>
        <RoutedPage language="en">
          <Home />
        </RoutedPage>
      </Route>
      <Route path={"/zh-CN"}>
        <RoutedPage language="zh-CN">
          <Home />
        </RoutedPage>
      </Route>
      <Route path={"/en/404"}>
        <RoutedPage language="en">
          <NotFound />
        </RoutedPage>
      </Route>
      <Route path={"/zh-CN/404"}>
        <RoutedPage language="zh-CN">
          <NotFound />
        </RoutedPage>
      </Route>
      {/* Final fallback route */}
      <Route component={LocalizedNotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
