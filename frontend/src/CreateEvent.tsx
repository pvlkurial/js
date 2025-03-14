import { useForm, SubmitHandler } from "react-hook-form";
import { AppSidebar } from "@/components/app-sidebar"
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "./components/ui/button"

interface Inputs {
  comp_name: string;
  comp_imageurl: string;
};

const CreateEvent = () => {
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<Inputs>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("http://localhost:5000/comps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit");
        }
       navigate("/events");
      })
      .catch(() => alert("An Error has happened processing this request!"));
  };

  return (
    <SidebarProvider>
      <title>Create Event | Match Dumper</title>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="events">Events</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator></BreadcrumbSeparator>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="">Create Event</BreadcrumbLink>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-10 items-center">
                  <div className="grid gap-4 md:grid-cols-1 grid-cols-1">
                    <div className="flex-1 rounded-xl bg-muted/50 p-25 items-center" >
                      <h1 className="text-3xl font-mono ml-10">Create Event</h1>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-10 m-0 ">
                          <input
                            {...register("comp_name", { required: true })}
                            placeholder="Competition Name"
                            className="inset-shadow-sm"
                          />
                          {errors.comp_name && <p className="text-black opacity-70">This field is required</p>}
                        </div>

                        <div className="p-10 m-0">
                          <input
                            {...register("comp_imageurl", { required: true })}
                            placeholder="Image URL"
                            className="inset-shadow-sm"
                          />
                          {errors.comp_imageurl && <p className="text-black opacity-70">This field is required</p>}
                        </div>
                        <div>
                          <Button className="p-10 ml-15 items-center cursor-pointer">Submit</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
  );
};

export default CreateEvent;
