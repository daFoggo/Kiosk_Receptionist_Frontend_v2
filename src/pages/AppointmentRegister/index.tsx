import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { authIp } from "@/utils/ip";

const formSchema = z
  .object({
    username: z.string().min(2).max(50),
    password: z.string().min(3).max(50),
    confirmPassword: z.string().min(2).max(50),
    email: z.string().email(),
    fullName: z.string().min(2).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mât khẩu không trùng khớp",
    path: ["confirmPassword"],
  });

const AppointmentRegister = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { confirmPassword, ...submitData } = values;
      const res = await axios.post(`${authIp}/register`, submitData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      navigate("/appointment");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl md:text-3xl">Đăng ký</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm md:text-base">
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ và tên"
                        {...field}
                        className="h-10 md:h-11"
                      />
                    </FormControl>
                    <FormDescription className="text-xs md:text-sm">
                      Tên thật của bạn
                    </FormDescription>
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm md:text-base">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập email"
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
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm md:text-base">
                      Tên người dùng
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên người dùng"
                        {...field}
                        className="h-10 md:h-11"
                      />
                    </FormControl>
                    <FormDescription className="text-xs md:text-sm">
                      Tên này sẽ được dùng để đăng nhập và sử dụng trong hệ
                      thống
                    </FormDescription>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm md:text-base">
                      Xác nhận mật khẩu
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu của bạn"
                        {...field}
                        className="h-10 md:h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-10 md:h-11 mt-4">
                Xác nhận
              </Button>
            </form>
          </Form>

          <div className="flex items-center gap-2 mt-6 text-sm md:text-base">
            <span>Đã có tài khoản?</span>
            <Button
              onClick={() => navigate("/auth/appointment/login")}
              variant="link"
              className="p-0 h-auto"
            >
              Đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentRegister;