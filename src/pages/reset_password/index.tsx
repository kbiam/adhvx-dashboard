import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { dataService } from "@/dataservice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const ResetPassword = () => {
  const [identity, setIdentity] = useState({
    Password: "",
    ConfirmPassword: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const query = useQuery();

  const token = query.get("token");

  const validatePassword = () => {
    const newErrors: string[] = [];

    if (identity.Password !== identity.ConfirmPassword) {
      newErrors.push("Passwords do not match");
    } else {
      if (identity.Password.length < 5) {
        newErrors.push("Password must be at least 5 characters long");
      }
      if (!/\d/.test(identity.Password)) {
        newErrors.push("Password must contain a number");
      }
      if (!/[A-Z]/.test(identity.Password)) {
        newErrors.push("Password must contain an uppercase letter");
      }
      if (!/[a-z]/.test(identity.Password)) {
        newErrors.push("Password must contain a lowercase letter");
      }
      if (!/[!@#$%^&*]/.test(identity.Password)) {
        newErrors.push("Password must contain a special character");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  async function onResetPassword() {
    if (!validatePassword()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    const response = await dataService.post("/auth/resetpassword", {
      Password: identity.Password,
      token,
    });
    if (response) {
      toast.success("Password reset successful! Redirecting to login...");
      navigate("/login");
    }
  }
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="items-center">
              <UserRound className="size-10 rounded-full bg-accent p-2.5 text-muted-foreground" />
              <CardTitle className="text-xl">Reset your password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="newpassword">New Password</Label>
                  </div>
                  <Input
                    id="newpassword"
                    type="password"
                    placeholder="Enter your new password"
                    required
                    onChange={(e) =>
                      setIdentity({ ...identity, Password: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    required
                    onChange={(e) =>
                      setIdentity({
                        ...identity,
                        ConfirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                {errors.length > 0 && (
                  <ul className="text-red-500 list-disc pl-5">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}

                <Button
                  onClick={onResetPassword}
                  type="submit"
                  className="w-full"
                >
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
