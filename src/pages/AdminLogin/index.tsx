import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import { loginIp } from "@/utils/ip";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(2, "Tên người dùng là bắt buộc"),
  password: z.string().min(3, "Mật khẩu là bắt buộc"),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(`${loginIp}`, values);
      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem("user", JSON.stringify(res.data.data));
      navigate("/admin");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra trong quá trình đăng nhập");
      form.setError("root", {
        type: "manual",
        message: "Có lỗi xảy ra trong quá trình đăng nhập",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl md:text-3xl">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm md:text-base">
                      Đăng nhập
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên người dùng"
                        {...field}
                        className="h-10 md:h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm md:text-base">
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        {...field}
                        className="h-10 md:h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <p className="text-red-500 text-xs md:text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}

              <Button type="submit" className="w-full h-10 md:h-11 mt-4">
                Xác nhận
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
