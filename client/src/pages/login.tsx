import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase";
import { FiLock } from "react-icons/fi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGithub();
      }
      setLocation("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || `Failed to sign in with ${provider}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <FiLock className="h-6 w-6" />
            Personal Vault
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleLogin('google')}
            className="w-full"
            variant="outline"
            disabled={isLoading}
          >
            <FaGoogle className="mr-2 h-4 w-4" />
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>

          <Button
            onClick={() => handleLogin('github')}
            className="w-full"
            variant="outline"
            disabled={isLoading}
          >
            <FaGithub className="mr-2 h-4 w-4" />
            {isLoading ? "Signing in..." : "Sign in with GitHub"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}