import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import { insertExpenseSchema, categoryEnum, paymentSourceEnum } from "@shared/schema";
import type { InsertExpense } from "@shared/schema";

interface ExpenseFormProps {
  onSuccess: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const queryClient = useQueryClient();
  const userId = auth.currentUser?.uid;

  const form = useForm<InsertExpense>({
    resolver: zodResolver(insertExpenseSchema),
    defaultValues: {
      userId: Number(userId),
      amount: 0,
      description: "",
      category: "Other",
      paymentSource: "Other",
      date: new Date().toISOString(),
    },
  });

  const createExpense = useMutation({
    mutationFn: (data: InsertExpense) =>
      apiRequest("POST", "/api/expenses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/expenses?userId=${userId}`] });
      onSuccess();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createExpense.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryEnum.options.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Source</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentSourceEnum.options.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Expense
        </Button>
      </form>
    </Form>
  );
}
