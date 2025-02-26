import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { KeyRoundIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dataService } from "@/dataservice";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/user.store";

const formSchema = z.object({
  Name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  Email: z.string().email({ message: "Invalid email" }),
});
export function ProfileSettings() {
  const { Name, Email } = useUserStore.getState();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Email: Email,
      Name: Name,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    dataService
      .post("/user/update", { Name: values["Name"] })
      .then(() => {
        toast("Updated", { type: "success" });
      })
      .catch(() => {
        form.reset();
      });
  }

  async function onResetPassword() {
    await dataService.post("/user/resetmypassword", {});
    toast("Email has been sent", { type: "success" });
  }

  return (
    <div className="flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          style={{ width: "50%" }}
          className="space-y-8 mt-4"
        >
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem className="w-50 flex flex-col items-start">
                <FormLabel className="">Name</FormLabel>
                <FormControl>
                  <Input placeholder="John doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Email"
            render={({ field }) => (
              <FormItem className="w-50 flex flex-col items-start">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    type="email"
                    placeholder="user@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-100 flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-100" variant={"secondary"}>
                  <KeyRoundIcon className="mr-2" size={14} /> Reset Password
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Password</AlertDialogTitle>
                  <AlertDialogDescription>
                    You would recieve an email with a link to reset your
                    password.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onResetPassword}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button className="w-100" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
