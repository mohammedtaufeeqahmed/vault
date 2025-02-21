import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseChart } from "@/components/expenses/expense-chart";
import { FiPlus } from "react-icons/fi";
import { auth } from "@/lib/firebase";
import type { Expense } from "@shared/schema";

export default function Expenses() {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const userId = auth.currentUser?.uid;

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: [`/api/expenses?userId=${userId}`],
  });

  const totalExpenses = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
          <DialogTrigger asChild>
            <Button>
              <FiPlus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ExpenseForm onSuccess={() => setShowExpenseForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Number of Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expenses?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseChart expenses={expenses || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses?.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ).map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold">${Number(expense.amount).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
