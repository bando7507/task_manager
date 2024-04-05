"use client";
import React from "react";

import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Moon, OctagonX, PlusCircle, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getTasks, postTask, putTask } from "@/api/taksApi";
import { toast } from "sonner";
import Cookies from "js-cookie";

const queryClient = new QueryClient();

const formSchemaTasks = z.object({
  task: z.string(),
  completed: z.boolean(),
  cancel: z.boolean(),
});

const formSchemaTasks2 = z.object({
  taskId: z.string(),
  task: z.string(),
  completed: z.boolean(),
  cancel: z.boolean(),
});

const formTasksScama = z.object({
  title: z.string(),
  description: z.string(),
  datecreate: z.date(),
  userId: z.number(),
  tasks: z.array(formSchemaTasks),
});

const TasksPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TasksPageRef />
    </QueryClientProvider>
  );
};

const TasksPageRef = () => {
  const { setTheme } = useTheme();
  const [info, setInfo] = React.useState<any>([]);

  const { data: session } = useSession();
  const navigation = useRouter();

  interface Info {}
  const getAllInfo = (el: any): void => {
    setInfo([el]);
  };

  const getCookieData = () => {
    const cookie = Cookies.get("access_connect");
    if (cookie) {
      const cookieData = JSON.parse(cookie);
      return cookieData;
    }
    return null;
  };

  // Utilisation
  const cookieData = getCookieData();
  const userId = cookieData?.id;
  const token = cookieData?.token;
  const userName = cookieData?.username;

  const formTasks = useForm<z.infer<typeof formTasksScama>>({
    defaultValues: {
      title: "",
      description: "",
      datecreate: new Date(Date.now()),
      userId: userId,
      tasks: [{ task: "", completed: false, cancel: false }],
    },
  });
  const formValTask = useForm<z.infer<typeof formSchemaTasks2>>({
    defaultValues: {
      taskId: "",
      task: "",
      completed: false,
      cancel: false,
    },
  });

  const getTaskInfo = (el: any): void => {
    formValTask.reset({
      taskId: el.id,
      task: el.task,
      completed: el.completed,
      cancel: el.cancel,
    });
  };

  const { fields, append } = useFieldArray({
    control: formTasks.control,
    name: "tasks",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: (variables: any) => {
      return postTask(variables, token);
    },
  });

  const { isPending: putTaskPending, mutate: putTaskMutate } = useMutation({
    mutationFn: (variables: any) => {
      return putTask(variables, token);
    },
  });

  const onSubmit = (values: z.infer<typeof formTasksScama>) => {
    // console.log(values);
    mutate(values, {
      onSuccess: (data) => {
        if (data) {
          toast.success("Tasks create 👌");
          queryTasks.refetch();
          formTasks.reset();
          formValTask.reset();
        }
      },
      onError: (error) => {
        if (error) {
          toast.error("error");
        }
      },
    });
  };
  const onSubmitTasks = (values: z.infer<typeof formSchemaTasks2>) => {
    putTaskMutate(values, {
      onSuccess: (data) => {
        if (data) {
          toast.success("Tasks edit 👌");
          queryTasks.refetch();
          setInfo([data]);
        }
      },
      onError: (error) => {
        if (error) {
          toast.error("error");
        }
      },
    });
  };

  const handleLogout = async () => {
    Cookies.remove("access_connect");
    navigation.push("/");
  };
  const queryTasks = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(userId, token),
  });

  // const checkAuthentication = () => {
  //   const accessConnectCookie = Cookies.get("access_connect");

  //   if (!accessConnectCookie) {
  //     navigation.push("/");
  //   }
  // };

  // checkAuthentication();

  return (
    <section className="grid grid-cols-2 p-4">
      <div className=" flex flex-col py-9 px-24 h-[95vh] overflow-hidden">
        <div>
          <h1 className="text-3xl font-semibold mb-1">{userName}</h1>
          <p className="text-sm mb-6 ">
            Welcome back to the workspace, we missed You!
          </p>

          <Input placeholder="Search Task or Project" />
        </div>
        <h2 className="mt-3">
          Projects ({queryTasks.data && queryTasks.data.length})
        </h2>
        <ScrollArea className="w-full h-[85%] p-9 rounded-md border">
          <div className="grid grid-cols-3 gap-3 mt-5">
            {queryTasks.data ? (
              queryTasks.data.map((el: any, id: any) => (
                <div key={id}>
                  <div
                    style={{
                      backgroundColor: el.codecoleur,
                    }}
                    className={`w-24 h-24 rounded-xl  flex justify-center items-center text-2xl font-bold cursor-pointer`}
                    onClick={() => getAllInfo(el)}
                  >
                    {el.title.slice(0, 1).toUpperCase()}
                  </div>
                  <h1 className="text-sm">{el.title}</h1>
                </div>
              ))
            ) : (
              <div className=" ">
                {queryTasks.isPending && (
                  <div className="">
                    <h1>Loading...</h1>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* {queryTasks.data && queryTasks.data.length == 0 && (
            <div className="h-full text-center">Empty</div>
          )} */}
        </ScrollArea>
      </div>

      <div className="relative w-full p-9 rounded-xl dark:bg-[#1e1d1d] shadow-lg ">
        <div className="absolute flex gap-2 items-center top-5 right-5 ">
          <Avatar>
            <AvatarImage
              src={(session && session?.user?.image) || ""}
              alt="shadcn"
            />

            <AvatarFallback>
              {session && session?.user?.image?.slice(0.2)}
            </AvatarFallback>
          </Avatar>

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

          <Button variant="default" onClick={handleLogout}>
            Log out
          </Button>
        </div>

        <div className="absolute bottom-10 right-12 z-50  ">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusCircle />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-[500px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create....</DialogTitle>
                {/* <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription> */}
              </DialogHeader>

              <div>
                <Form {...formTasks}>
                  <form
                    onSubmit={formTasks.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {/* <form className="space-y-8"> */}
                    <div>
                      <FormField
                        control={formTasks.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formTasks.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us a little..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      {fields.map((el: any, id: any) => (
                        <div key={id}>
                          <Controller
                            control={formTasks.control}
                            name={`tasks[${id}].task`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Task {id}</FormLabel>
                                <FormControl>
                                  <Input placeholder="title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        type="button"
                        className="mt-3"
                        onClick={() =>
                          append({
                            task: "",
                            completed: false,
                            cancel: false,
                          })
                        }
                      >
                        Add Task
                      </Button>
                    </div>
                    <DialogClose asChild>
                      <Button className="w-full">Create</Button>
                    </DialogClose>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {info.length == 0 ? (
          <div className="flex items-center flex-col gap-5 justify-center h-full">
            <h1 className="text-2xl">Select one project</h1>
            <OctagonX size={50} className="dark:text-white text-black" />
          </div>
        ) : (
          <div className="mt-10 h-full">
            <ScrollArea className="h-[85%] w-full p-9 rounded-md border">
              {info.map((el: any, id: number) => (
                <div key={id}>
                  <div className="sticky top-0 dark:bg-[#1e1d1d]  pb-4">
                    <h1 className="text-2xl">{el.title}</h1>
                    <p className="text-sm">{el.description}</p>
                  </div>

                  <div className="mt-10">
                    <h1 className="text-xl">Taks</h1>
                    <span className="block h-[1px] w-full bg-slate-400"></span>
                    <div className="flex flex-col gap-6 mt-5">
                      {el.tasks.map((item: any) => (
                        <div key={item.id}>
                          <div className="flex items-center gap-5">
                            <div className="flex-1 flex items-center justify-between">
                              <p>{item.task}</p>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="default"
                                    onClick={() => getTaskInfo(item)}
                                  >
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Task</DialogTitle>
                                  </DialogHeader>

                                  <div>
                                    <Form {...formValTask}>
                                      <form
                                        onSubmit={formValTask.handleSubmit(
                                          onSubmitTasks
                                        )}
                                        className="space-y-6"
                                      >
                                        <div>
                                          <div className="flex flex-col  gap-5 w-full">
                                            <FormField
                                              control={formValTask.control}
                                              name="task"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Title</FormLabel>
                                                  <FormControl className="w-full">
                                                    <Input
                                                      placeholder="title"
                                                      className="w-full"
                                                      {...field}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />

                                            <FormField
                                              control={formValTask.control}
                                              name="completed"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormControl>
                                                    <Label className="flex items-center gap-3">
                                                      Completed
                                                      <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                          field.onChange
                                                        }
                                                      />
                                                    </Label>
                                                  </FormControl>
                                                </FormItem>
                                              )}
                                            />
                                            <FormField
                                              control={formValTask.control}
                                              name="cancel"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormControl>
                                                    <Label className="flex items-center gap-3">
                                                      Cancel
                                                      <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                          field.onChange
                                                        }
                                                      />
                                                    </Label>
                                                  </FormControl>
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          <Separator className="mt-2" />
                                        </div>

                                        {/* <Button type="submit">Submit</Button> */}

                                        <DialogClose
                                          type="submit"
                                          className="dark:bg-white dark:text-black px-3 py-2 rounded-md "
                                        >
                                          Submit
                                        </DialogClose>
                                      </form>
                                    </Form>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          <Separator className="mt-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </section>
  );
};

export default TasksPage;
