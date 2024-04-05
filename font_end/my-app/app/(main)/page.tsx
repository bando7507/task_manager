"use client";
import React from "react";
import { z } from "zod";
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { postLog } from "@/api/taksApi";
import { toast } from "sonner";
import Cookies from "js-cookie";

const queryClient = new QueryClient();

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const MainPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainPageRef />
    </QueryClientProvider>
  );
};

const MainPageRef = () => {
  const { setTheme } = useTheme();
  const navigation = useRouter();
  const { data: session } = useSession();
  // console.log(session);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: (variables: any) => {
      return postLog(variables);
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: (data) => {
        if (data) {
          Cookies.set("access_connect", JSON.stringify(data), {
            expires: 1,
            sameSite: "strict",
          });
          setIsLoading(true);
          setTimeout(() => {
            toast.success("Succes 👌");
            navigation.push("/mytasks");
            // localStorage.setItem("userinfo", JSON.stringify(data));
            setIsLoading(false);
          }, 3000);
        }
      },
      onError: (error) => {
        if (error) {
          toast.error("error");
        }
      },
    });
  }

  return (
    <section className="flex items-center ">
      <div className="fixed top-10 left-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-[50%] h-screen">
        <div className=" w-full h-full flex flex-col justify-center px-12 xl:px-32 2xl:px-44">
          <div>
            <h1 className="text-blue-400 font-bold text-2xl mb-3">Dotwork</h1>
            <p className="text-3xl font-bold mb-2">Log in to your Account</p>
            <small className="block text-base mb-5">
              Welcome back! Select method to log in:
            </small>
          </div>

          <div className="w-full flex gap-3 items-center justify-center mb-4">
            <Button>Github</Button>
            <Button>Facebook</Button>
          </div>
          <div className="w-full flex gap-3 items-center justify-center">
            <span className="block w-[120px] h-[1px] bg-[#45454539] 2xl:w-[140px]"></span>
            <small>or continue with email</small>
            <span className="block w-[120px] h-[1px] bg-[#45454539] 2xl:w-[140px]"></span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mot de passe"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Checkbox />

                  <span className="text-sm font-bold">Remenber me?</span>
                </Label>

                <span className="text-sm font-bold cursor-pointer">
                  Forgot Password?
                </span>
              </div>

              <Button className="w-full">Log in</Button>

              {isLoading && (
                <div className="flex justify-center items-center ">
                  <Image
                    src="/tail-spin.svg"
                    alt="loading"
                    width={30}
                    height={30}
                  />
                </div>
              )}
              <p className="text-center">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  type="button"
                  className="p-0"
                  onClick={() => navigation.push("/register")}
                >
                  Create an account
                </Button>
              </p>
            </form>
          </Form>
        </div>
      </div>
      <div className="w-[50%] h-screen bg-[#dfdfdf] dark:bg-[#1e1d1d]">
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent>
            <CarouselItem className="h-screen">
              <div className="w-full h-full flex flex-col justify-center items-center">
                <Image
                  src="/task_listBlack.svg"
                  width={300}
                  height={300}
                  alt="list task"
                />

                <div className="mt-32">
                  <h1>Follow the list of your projects and your tasks</h1>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-screen">
              <div className="w-full h-full flex flex-col justify-center items-center">
                <Image
                  src="/add_tasksBlack.svg"
                  width={300}
                  height={300}
                  alt="list task"
                />

                <div className="mt-32">
                  <h1>Create your projects and tasks</h1>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-screen">
              <div className="w-full h-full flex flex-col justify-center items-center">
                <Image
                  src="/project_completedBlack.svg"
                  width={300}
                  height={300}
                  alt="list task"
                />

                <div className="mt-32">
                  <h1>Accomplish your projects and tasks</h1>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      </div>
    </section>
  );
};

export default MainPage;
