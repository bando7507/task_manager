"use client";
import React from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { z } from "zod";

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
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { postRegister } from "@/api/taksApi";
import { toast } from "sonner";

const queryClient = new QueryClient();
const formSchema = z.object({
  email: z.string().email(),
  nom: z.string(),
  prenoms: z.string(),
  username: z.string(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const RegisterPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RegisterPageRef />
    </QueryClientProvider>
  );
};

const RegisterPageRef = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { setTheme } = useTheme();
  const navigation = useRouter();

  // console.log(session);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenoms: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: (variables: any) => {
      return postRegister(variables);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: (data) => {
        if (data) {
          setIsLoading(true);
          setTimeout(() => {
            toast.success("Succes 👌");
            navigation.push("/");
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
            <p className="text-3xl font-bold mb-2">Sign in to your Account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firts Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Firts Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prenoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Las tName" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button className="w-full">Sign in</Button>

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
                you have an account?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  type="button"
                  onClick={() => navigation.push("/")}
                >
                  Log in
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

export default RegisterPage;
