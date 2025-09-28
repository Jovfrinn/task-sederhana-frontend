import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandInput } from "@/components/ui/command";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Project } from "@/services/projectService";
import { ProjectService } from "@/services/projectService";
import { ProjectModal } from "@/components/ProjectModal";
import Swal from "sweetalert2";
import { showSuccess, showError } from "@/helper/alert";
import { Skeleton } from "@/components/ui/skeleton";


const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEditId, setOpenEditId] = useState<number | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await ProjectService.getAll();
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        console.error("Failed to get project", err);
      } finally{
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  //search filter
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredProjects(
      projects.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch)
      )
    );
  }, [search, projects]);

  const handleAddProject = async (
    project: Omit<Project, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const newProject = await ProjectService.create(project);
      setProjects([...projects, newProject]);
      setOpenAdd(false);

      showSuccess("Project created successfully!");
    } catch (error) {
      setOpenAdd(false);
      console.error("Failed to create project", error);
      showError("Failed to create project");
    }
  };

  const handleEditProject = async (
    id: number,
    project: Omit<Project, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const updatedProject = await ProjectService.update(id, project);

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updatedProject : p))
      );
      setOpenEditId(null);
      
      showSuccess("Project updated successfully!");
    } catch (error) {
      setOpenEditId(null);

      console.error("Failed to update project", error);
      showError("Failed to update project");
    }
  };

  const handleDeleteProject = async (id: number) => {

    const confirm = await Swal.fire({
    title: "Are you sure you want to delete it??",
    text: "Data cannot be returned!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DC2626",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "Cancel",
    });
    if (confirm.isConfirmed){
    try {
      await ProjectService.delete(id);

      setProjects((prev) => prev.filter((p) => p.id !== id));
      
      showSuccess("Project deleted successfully!");
    } catch (error) {
      console.error("Gagal hapus project", error);
      showError("Failed to delete project");
    }
  }
};

  const handleJoinProject = async (id: number) => {
    try {
      await ProjectService.join(id);
      alert("Berhasil join project!");

      navigate(`/project/${id}`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal join project");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between">
        <Command className="w-[24%]">
          <CommandInput
            placeholder="Search Project..."
            value={search}
            onValueChange={(val) => setSearch(val)}
          />
        </Command>
        {user?.role === "admin" && (
        <Dialog open={openAdd} onOpenChange={setOpenAdd}> 
          <DialogTrigger asChild >
            <Button>
              <Plus size={18} /> Tambah Project
            </Button>
          </DialogTrigger>

          <ProjectModal mode="add" onSubmit={handleAddProject} />
        </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-8 w-24" />
            </Card>
          ))
        ) : filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">
                {project.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs ml-1 mb-4 text-gray-600">
                {project.description}
              </div>
              <Button
                type="button"
                className="text-xs mx-1"
                onClick={() =>
                  project.joined
                    ? navigate(`/project/${project.id}`)
                    : handleJoinProject(project.id)
                }
              >
                {project.joined ? "Go to Project" : "Join"}
              </Button>
              {user?.role === "admin" && (
                <>
                  <Dialog   open={openEditId === project.id}  onOpenChange={(o) => setOpenEditId(o ? project.id : null)}>
                    <DialogTrigger>
                      <Button
                        type="button"
                        variant="default"
                        className="text-xs bg-blue-500 hover:bg-blue-300"
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <ProjectModal
                      mode="edit"
                      initialData={{
                        title: project.title,
                        description: project.description,
                        start_date: project.start_date,
                        end_date: project.end_date,
                      }}
                      onSubmit={(data) => handleEditProject(project.id, data)}
                    />
                  </Dialog>
                  <Button
                    type="button"
                    variant="destructive"
                    className="text-xs mx-1"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
