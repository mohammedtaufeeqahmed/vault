import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseChart } from "@/components/expenses/expense-chart";
import { FiLock, FiDollarSign, FiFile } from "react-icons/fi";
import { auth } from "@/lib/firebase";
import type { Expense, Credential, Document } from "@shared/schema";

export default function Dashboard() {
  const userId = auth.currentUser?.uid;

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: [`/api/expenses?userId=${userId}`],
  });

  const { data: credentials } = useQuery<Credential[]>({
    queryKey: [`/api/credentials?userId=${userId}`],
  });

  const { data: documents } = useQuery<Document[]>({
    queryKey: [`/api/documents?userId=${userId}`],
  });

  const totalExpenses = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stored Credentials</CardTitle>
            <FiLock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credentials?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <FiDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stored Documents</CardTitle>
            <FiFile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseChart expenses={expenses || []} />
        </CardContent>
      </Card>
    </div>
  );
}
