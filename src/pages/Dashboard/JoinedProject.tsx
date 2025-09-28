import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandInput } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Project } from "@/services/projectService";
import { ProjectService } from "@/services/projectService";
import { Skeleton } from "@/components/ui/skeleton";


const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    ProjectService.getProjectJoined().then(setProjects).finally(() => { setLoading(false) });
  }, []);

  return (
    <>
      <div className="mb-4 flex justify-between">
        <Command className="w-[24%]">
          <CommandInput placeholder="Cari Project..." />
        </Command>
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
        ) : projects.map((project) => (
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
                onClick={() => {
                  navigate(`/project/${project.id}`);
                }}
              >
                Go to Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
