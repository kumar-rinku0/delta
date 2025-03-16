import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import axios from "axios";

const formSchema = z.object({
  companyName: z.string().min(2).max(50),
  companyAddress: z.string().min(8).max(50),
});

const CreateComp = ({ userId }: { userId: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyAddress: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    axios
      .post("/api/company/create", { ...values, _id: userId })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>Create Company</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{""}</AlertDialogTitle>
          <AlertDialogDescription>{""}</AlertDialogDescription>
          <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
            <CardHeader>
              <CardTitle className="text-xl">Create Company</CardTitle>
              <CardDescription>Enter your company information!</CardDescription>
            </CardHeader>
            <CardContent className="text-left">
              <div className="flex flex-col gap-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="companyAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={false}>
                      Create Company
                    </Button>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </AlertDialogHeader>
        <AlertDialogFooter></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateComp;
