import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { USER_ROLES } from "@/constants";
import { InputDropDown } from "@/custom_components/input_dropdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserRoundPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dataService } from "@/dataservice";
import { toast } from "react-toastify";

const formSchema = z.object({
  Name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  Email: z.string().email({ message: "Invalid email" }),
  Role: z.enum([USER_ROLES.USER, USER_ROLES.ADMIN]),
});

export function AddUser() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Email: "",
      Name: "",
      Role: USER_ROLES.USER,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    dataService.post("/admin/user/invite", values).then(() => {
      toast("An invite email has been sent to the user.", { type: "success" });
      form.reset();
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="ml-auto flex gap-2 items-center">
        <Button size="sm">
          <UserRoundPlus  className="h-4 w-4" /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-4"
              >
                <FormField
                  control={form.control}
                  name="Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <InputDropDown
                          id="role"
                          options={[
                            { value: USER_ROLES.ADMIN, label: "Admin" },
                            { value: USER_ROLES.USER, label: "User" },
                          ]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="float-right" type="submit">
                  Invite
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
