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
import { encrypt } from "@/lib/encryption";
import { apiRequest } from "@/lib/queryClient";
import { insertDocumentSchema } from "@shared/schema";
import type { InsertDocument } from "@shared/schema";

interface DocumentUploadProps {
  onSuccess: () => void;
}

export function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const queryClient = useQueryClient();

  const form = useForm<InsertDocument>({
    resolver: zodResolver(insertDocumentSchema),
    defaultValues: {
      name: "",
      content: "",
      type: "",
    },
  });

  const createDocument = useMutation({
    mutationFn: (data: InsertDocument) => {
      const encryptedData = {
        ...data,
        content: encrypt(data.content),
      };
      return apiRequest("POST", "/api/documents", encryptedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      onSuccess();
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Use base64 encoding for binary files
        const content = event.target?.result as string;
        form.setValue("content", content);
        form.setValue("name", file.name);

        // Set a more descriptive type based on the file
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        let type = 'unknown';

        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          type = 'image';
        } else if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
          type = 'document';
        } else if (['txt', 'md'].includes(fileExtension)) {
          type = 'text';
        }

        form.setValue("type", type);
      };
      // Read as base64 to support binary files
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createDocument.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Upload Document</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              onChange={handleFileUpload}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.md"
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button 
          type="submit" 
          className="w-full"
          disabled={createDocument.isPending}
        >
          {createDocument.isPending ? "Uploading..." : "Upload Document"}
        </Button>
      </form>
    </Form>
  );
}