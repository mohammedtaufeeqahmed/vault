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
import { auth } from "@/lib/firebase";
import { encrypt } from "@/lib/encryption";
import { generatePassword } from "@/lib/password-generator";
import { apiRequest } from "@/lib/queryClient";
import { insertCredentialSchema } from "@shared/schema";
import type { InsertCredential } from "@shared/schema";

interface CredentialFormProps {
  onSuccess: () => void;
}

export function CredentialForm({ onSuccess }: CredentialFormProps) {
  const queryClient = useQueryClient();
  const userId = auth.currentUser?.uid;

  const form = useForm<InsertCredential>({
    resolver: zodResolver(insertCredentialSchema),
    defaultValues: {
      userId: Number(userId),
      website: "",
      username: "",
      password: "",
    },
  });

  const createCredential = useMutation({
    mutationFn: (data: InsertCredential) => {
      const encryptedData = {
        ...data,
        password: encrypt(data.password),
      };
      return apiRequest("POST", "/api/credentials", encryptedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/credentials?userId=${userId}`] });
      onSuccess();
    },
  });

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    form.setValue("password", newPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createCredential.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <Button type="button" variant="outline" onClick={handleGeneratePassword}>
                  Generate
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Credential
        </Button>
      </form>
    </Form>
  );
}
