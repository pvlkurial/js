import { useForm, SubmitHandler } from "react-hook-form";
import { AppSidebar } from "@/components/app-sidebar"
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
  team_name: string;
  logo_url: string;
  description: string;
};

const CreateTeam = () => {
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<Inputs>();


  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("http://localhost:5000/teams", {
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
        alert("Your application is updated.");
      })
      .catch(() => alert("Submission has failed."));
  };

  return (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
    <div className="create-event-container">
      <title>Create Team | Match Dumper</title>
      <div className="create-event-box">
        <h2>Create Team</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              {...register("team_name", { required: true })}
              placeholder="Team Name"
              className="input-field"
            />
            {errors.team_name && <p className="error-text">This field is required</p>}
          </div>

          <div className="input-group">
            <input
              {...register("logo_url", { required: true })}
              placeholder="Team Logo URL"
              className="input-field"
            />
            {errors.logo_url && <p className="error-text">This field is required</p>}
          </div>

          <div className="input-group">
            <input
              {...register("description", { required: false })}
              placeholder="Description"
              className="input-field"
            />
            {errors.description && <p className="error-text">This field is required</p>}
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
          </SidebarInset>
        </SidebarProvider>
  );
};

export default CreateTeam;
