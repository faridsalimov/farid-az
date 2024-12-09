"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthFormData } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().email("Düzgün email daxil edin"),
  password: z.string().min(6, "Şifrə minimum 6 simvol olmalıdır"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Ad minimum 2 simvol olmalıdır"),
});

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (
    data: AuthFormData
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(type === "login" ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const handleSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await onSubmit(data);

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Xəta baş verdi");
      }
    } catch (err) {
      setError("Sistemdə xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {type === "register" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad</FormLabel>
                <FormControl>
                  <Input placeholder="Adınızı daxil edin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email ünvanınızı daxil edin"
                  autoComplete={type === "login" ? "username" : "email"}
                  {...field}
                />
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
              <FormLabel>Şifrə</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Şifrənizi daxil edin"
                  autoComplete={
                    type === "login" ? "current-password" : "new-password"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Gözləyin..."
              : type === "login"
              ? "Daxil ol"
              : "Qeydiyyatdan keç"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {type === "login" ? (
              <>
                Hesabınız yoxdur?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline"
                >
                  Qeydiyyatdan keçin
                </Link>
              </>
            ) : (
              <>
                Artıq hesabınız var?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Daxil olun
                </Link>
              </>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
