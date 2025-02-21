import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CredentialForm } from "@/components/vault/credential-form";
import { DocumentUpload } from "@/components/vault/document-upload";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { auth } from "@/lib/firebase";
import { decrypt } from "@/lib/encryption";
import type { Credential, Document } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Vault() {
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const queryClient = useQueryClient();
  const userId = auth.currentUser?.uid;

  const { data: credentials } = useQuery<Credential[]>({
    queryKey: [`/api/credentials?userId=${userId}`],
  });

  const { data: documents } = useQuery<Document[]>({
    queryKey: [`/api/documents?userId=${userId}`],
  });

  const deleteCredential = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/credentials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/credentials?userId=${userId}`] });
    },
  });

  const deleteDocument = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents?userId=${userId}`] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Secure Vault</h1>

      <Tabs defaultValue="credentials">
        <TabsList>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-4">
          <Dialog open={showCredentialForm} onOpenChange={setShowCredentialForm}>
            <DialogTrigger asChild>
              <Button>
                <FiPlus className="mr-2 h-4 w-4" />
                Add Credential
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CredentialForm onSuccess={() => setShowCredentialForm(false)} />
            </DialogContent>
          </Dialog>

          <div className="grid gap-4 md:grid-cols-2">
            {credentials?.map((cred) => (
              <Card key={cred.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{cred.website}</h3>
                      <p className="text-sm text-muted-foreground">
                        Username: {cred.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Password: {decrypt(cred.password)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCredential.mutate(cred.id)}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Dialog open={showDocumentUpload} onOpenChange={setShowDocumentUpload}>
            <DialogTrigger asChild>
              <Button>
                <FiPlus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DocumentUpload onSuccess={() => setShowDocumentUpload(false)} />
            </DialogContent>
          </Dialog>

          <div className="grid gap-4 md:grid-cols-2">
            {documents?.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {doc.type}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteDocument.mutate(doc.id)}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
