import { Loader2Icon, Moon, Sun } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { dataService } from "@/dataservice";
import { useUserStore } from "@/store/user.store";
import { useNavigate } from "react-router-dom";
import { authenticate } from "@/utils/auth";
import { AuthResponse } from "@/utils/types";
import { ThemeToggle } from "@/custom_components/theme_toggle";

type FormData = {
  name: string;
  email: string;
  phoneNumber: string;
};

export const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    e.target.value = value.replace(/\D/g, '').slice(0, 10);
  };



  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const loginResponse: AuthResponse = await dataService.post(
        "/auth/signin",
        data
      );

      if (loginResponse) {
        useUserStore.setState(loginResponse.user);
        authenticate(loginResponse.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`h-screen w-full p-4 md:p-16 bg-white dark:bg-black transition-colors duration-200`}>
      <div
        className="fixed top-4 right-8 md:right-4 rounded-full p-2 h-10 w-10"
      >
        <ThemeToggle/>
      </div>

      <div className="max-w-full mx-auto p-4 h-full border rounded-lg border-black/20 dark:border-white/20 flex flex-col md:flex-row shadow-lg">
        <div className="hidden md:flex md:w-1/2 h-full bg-white dark:bg-black border-r border-black/50 dark:border-white/20 items-center justify-center">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-300">ADHVX</div>
        </div>
        
        <div className="w-full md:w-1/2 h-full flex flex-col px-4 md:px-12 py-8 gap-10 justify-center">
          <div className="flex flex-col gap-3 items-start justify-center">
            <h1 className="text-3xl text-black dark:text-white font-semibold">Welcome. Let's get started.</h1>
            <p className="text-black/70 dark:text-white/70">To begin, tell us a bit about yourself</p>
          </div>
          
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-1 items-start justify-center">
                <div className="flex w-full items-center justify-between">
                  <Label htmlFor="name" className="text-base font-normal text-black dark:text-white">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  {errors.name && (
                    <span className="text-sm text-red-500">This field is Required.</span>
                  )}
                </div>
                <Input
                  id="name"
                  placeholder="Nice to meet you!"
                  {...register("name", { required: true })}
                  className="mt-1 h-11 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-white/20"
                />
              </div>

              <div className="flex flex-col gap-1 items-start justify-center">
                <div className="flex w-full items-center justify-between">
                  <Label htmlFor="email" className="text-base font-normal text-black dark:text-white">
                    Business Email <span className="text-red-500">*</span>
                  </Label>
                  {errors.email && (
                    <span className="text-sm text-red-500">
                      {errors.email.type === "pattern" 
                        ? "Gmail addresses are not allowed" 
                        : "This field is Required."}
                    </span>
                  )}
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="We don't spam!"
                  {...register("email", { 
                    required: true,
                    pattern: {
                      value: /^(?!.*@gmail\.com$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                      message: "Gmail addresses are not allowed"
                    }
                  })}
                  className="mt-1 h-11 text-black dark:text-black focus:ring-2 focus:ring-blue-500 ddark:bg-black dark:border-white/20"
                />
              </div>

              <div className="flex flex-col gap-1 items-start justify-center">
                <div className="flex w-full items-center justify-between">
                  <Label htmlFor="phoneNumber" className="text-base font-normal text-black dark:text-white">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  {errors.phoneNumber && (
                    <span className="text-sm text-red-500">
                      {errors.phoneNumber.type === "pattern" 
                        ? "Please enter a valid 10-digit phone number" 
                        : "This field is Required."}
                    </span>
                  )}
                </div>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="We respect your privacy!"
                  {...register("phoneNumber", { 
                    required: true,
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Please enter a valid 10-digit phone number"
                    }
                  })}
                  onInput={handlePhoneInput}
                  className="mt-1 h-11 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-white/20"
                  maxLength={10}
                />
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 text-left">
                By signing up, I accept the ADHVX's{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
              </div>

              <Button
                size={"lg"}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 mt-6 border-none"
              >
                {isLoading && <Loader2Icon className="animate-spin mr-2" />}
                <p className="text-white">Get Started!</p>
              </Button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};