import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  FiHome,
  FiLock,
  FiDollarSign,
} from "react-icons/fi";

export default function SidebarNav() {
  return (
    <div className="h-screen w-64 bg-sidebar border-r border-border flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold text-sidebar-foreground">Personal Vault</h1>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start">
              <FiHome className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link href="/vault">
            <Button variant="ghost" className="w-full justify-start">
              <FiLock className="mr-2 h-4 w-4" />
              Vault
            </Button>
          </Link>

          <Link href="/expenses">
            <Button variant="ghost" className="w-full justify-start">
              <FiDollarSign className="mr-2 h-4 w-4" />
              Expenses
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}