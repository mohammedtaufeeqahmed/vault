import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";
import Vault from "@/pages/vault";
import Expenses from "@/pages/expenses";
import NotFound from "@/pages/not-found";
import SidebarNav from "@/components/layout/sidebar-nav";

function MainLayout({ component: Component }: { component: React.ComponentType }) {
  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <Component />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={() => <MainLayout component={Dashboard} />} />
        <Route path="/vault" component={() => <MainLayout component={Vault} />} />
        <Route path="/expenses" component={() => <MainLayout component={Expenses} />} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;