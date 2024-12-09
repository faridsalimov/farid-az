import AuthForm from "@/components/auth/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Daxil ol</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm type="login" onSubmit={login} />
        </CardContent>
      </Card>
    </div>
  );
}
