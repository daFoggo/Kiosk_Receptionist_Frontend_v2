import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routes } from "@/router/routes";

const formSchema = z.object({
  cccd_id: z.string().nonempty(),
  password: z.string().nonempty(),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuth()?.login ?? (() => Promise.resolve(false));
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cccd_id: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const success = await login(values.cccd_id, values.password);

      if (success) {
        toast.success("Đăng nhập thành công");
        navigate(routes.appointment.departmentList());
      } else {
        toast.error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[90%] sm:w-[425px]">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Hệ thống đăng ký lịch hẹn</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col items-center"
            >
              <FormField
                control={form.control}
                name="cccd_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mã CCCD</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã CCCD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mật khẩu"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
