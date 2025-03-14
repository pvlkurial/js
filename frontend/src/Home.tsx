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

export default function Home() {
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
            <a
                href="events"
                className="relative aspect-video rounded-xl bg-muted/50 hover:bg-muted/100 
                flex justify-center items-center h-full overflow-hidden 
                bg-[url(/public/orbit.jpg)] bg-cover duration-500 ease-in-out
                 hover:bg-[position:50%_60%] hover:opacity-100 opacity-70"
              >
              <h1 className="text-center text-5xl text-white font-mono z-50 opacity-150">EVENTS</h1>
            </a>
            <a href="players" className="relative aspect-video rounded-xl bg-muted/50 hover:bg-muted/100 
                flex justify-center items-center h-full overflow-hidden 
                bg-[url(/public/bezalk.jpg)] bg-cover duration-500 ease-in-out
                 hover:bg-[position:50%_60%] hover:opacity-100 opacity-70" >
              <h1 className="text-center text-5xl font-mono text-white">PLAYERS</h1>
            </a>
            <a className="relative aspect-video rounded-xl bg-muted/50 hover:bg-muted/100 
                flex justify-center items-center h-full overflow-hidden 
                bg-[url(/public/Thumbnail.jpg)] bg-cover duration-500 ease-in-out
                 hover:bg-[position:50%_60%] hover:opacity-100 opacity-70" >
              <h1 className="text-center text-5xl font-mono text-white">TEAMS</h1>
            </a>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
            <h1 className="text-center text-5xl font-mono text-neutral-700 p-5">MOST RECENT EVENTS</h1>
            <h2 className="text-center text-3xl font-mono text-neutral-700 p-5">TBA</h2>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
