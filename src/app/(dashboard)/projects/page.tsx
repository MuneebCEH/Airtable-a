import { getProjects, createProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage your projects and data sheets.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form action={async (formData) => {
                            "use server"
                            await createProject(formData)
                        }}>
                            <DialogHeader>
                                <DialogTitle>Create Project</DialogTitle>
                                <DialogDescription>
                                    Create a new project workspace for your team.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Project Alpha"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        placeholder="Short description..."
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create Project</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.length === 0 && (
                    <Card className="col-span-full border-dashed">
                        <CardHeader>
                            <CardTitle>No projects found</CardTitle>
                            <CardDescription>Get started by creating a new project above.</CardDescription>
                        </CardHeader>
                    </Card>
                )}
                {projects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                                <CardDescription>{project.description || "No description"}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    {project._count?.sheets ?? 0} Sheets
                                </div>
                            </CardContent>
                            <CardFooter className="text-xs text-muted-foreground">
                                Updated {new Date(project.updatedAt).toLocaleDateString()}
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
