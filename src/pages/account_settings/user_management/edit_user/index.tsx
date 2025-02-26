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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserRoundPenIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dataService } from "@/dataservice";
import { toast } from "react-toastify";
import { InputDropDown } from "@/custom_components/input_dropdown";

const formSchema = z.object({
  Name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  Email: z.string().email({ message: "Invalid email" }),
  Role: z.enum([USER_ROLES.USER, USER_ROLES.ADMIN]),
});

interface EditUserData extends z.infer<typeof formSchema> {
  _id: string;
}

interface EditUserProp {
  userData: EditUserData;
}

export function EditUser({ userData }: EditUserProp) {
  const isAccountOwner = userData.Role === USER_ROLES.ACCOUNT_OWNER;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: isAccountOwner,
    defaultValues: {
      Email: userData.Email,
      Name: userData.Name,
      Role: userData.Role,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    dataService
      .post(`/admin/user/${userData._id}`, {
        Name: values.Name,
        Role: values.Role,
      })
      .then(() => {
        toast("Updated", { type: "success" });
      })
      .catch(() => {
        form.reset();
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="ml-auto flex gap-2 items-center">
        <Button size="sm" variant={"outline"}>
          <UserRoundPenIcon size={12} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
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
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isAccountOwner && (
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
                )}

                <Button
                  disabled={isAccountOwner}
                  className="float-right"
                  type="submit"
                >
                  Update
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
