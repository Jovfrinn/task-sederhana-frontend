import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { Tasks } from "@/services/taskService";
import { useParams } from "react-router-dom";
import { TaskService } from "@/services/taskService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandInput } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { TaskModal } from "@/components/TaskModal";
import AssignUserModal from "@/components/AssignUserModal";
import TaskStatusFilter from "@/components/TaskStatusFilter";
import { Circle, Timer, CircleCheckBig } from "lucide-react";
import Swal from "sweetalert2";
import { showSuccess, showError } from "@/helper/alert";
import { Skeleton } from "@/components/ui/skeleton";

type Task = {
  project_id: number;
  title: string;
  status: string;
  created_by: string;
};

type User = {
  nama: string;
  role: string;
};

const Task = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [joinedUsers, setJoinedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Tasks[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEditId, setOpenEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (id) {
      setLoading(true);
      TaskService.getTaskById(Number(id))
        .then((data) => {
          setTasks(data);
        })
        .catch(() => {
          showError("Failed load task");
        }).finally(() => {
          setLoading(false)
        });
    }
  }, [id]);

  //search filter
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredTasks(
      tasks.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.status.toLowerCase().includes(lowerSearch) ||
          (p.user &&
            typeof p.user === "object" &&
            p.user.name &&
            p.user.name.toLowerCase().includes(lowerSearch))
      )
    );
  }, [search, tasks]);

  useEffect(() => {
    if (id) {
      TaskService.getJoinedUsers(Number(id))
        .then(setJoinedUsers)
        .catch(() => showError("Failed to load user join"));
    }
  }, [id]);

  const handleAddTask = async (
    task: Omit<Tasks, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const projectId = Number(id);

      await TaskService.create(projectId, task);

      const refreshed = await TaskService.getTaskById(projectId);
      setTasks(refreshed);

      setOpenAdd(false);

      showSuccess("Task Created Successfully!");
    } catch (error) {
      console.error("Failed to create task", error);
      showError("Failed to create task");
    }
  };

  const handleEditTask = async (
    id: number,
    tasks: Omit<Tasks, "id" | "created_at" | "updated_at">
  ) => {
    try {
      setLoading(true);
      const updatedTask = await TaskService.update(id, tasks);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedTask } : t))
      );

      setOpenEditId(null);

      showSuccess("Task updated successfully!");
    } catch (error: any) {
      setOpenEditId(null);
      console.error("Failed to update task", error);

      const message = error.response?.data?.message || "Gagal update task";
      Swal.fire({
        icon: "error",
        title: "Oops.",
        text: message,
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
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
    if (confirm.isConfirmed) {
      try {
        await TaskService.delete(id);

        setTasks((prev) => prev.filter((p) => p.id !== id));
        showSuccess("Task deleted successfully!");
      } catch (error) {
        console.error("Failed to delete task", error);
        showError("Failed to delete task");
      }
    }
  };

  
  return (
    <>
      <div className="mb-4 flex justify-between">
        <div className="flex gap-2">
          <Command className="w-[100%]">
            <CommandInput
              placeholder="Search Task..."
              value={search}
              onValueChange={(val) => setSearch(val)}
            />
          </Command>
          <TaskStatusFilter
            onFilter={(selectedStatuses: string[]) => {
              if (selectedStatuses.length === 0) {
                setFilteredTasks(tasks);
              } else {
                setFilteredTasks(
                  tasks.filter((t) => selectedStatuses.includes(t.status))
                );
              }
            }}
          />
        </div>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>

          <TaskModal mode="add" onSubmit={handleAddTask} />
        </Dialog>
      </div>

      <Table className="bg-white">
        <TableCaption>A list of recent tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-30">No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-40">Status</TableHead>
            <TableHead className="text-center w-20">Created By</TableHead>
            <TableHead className="text-center w-20">Assign</TableHead>
            <TableHead className="text-center w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-32 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-32 mx-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-16 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium pl-6">{index + 1}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell className="flex align-middle gap-2">
                  {task.status == "Todo" ? (
                    <Circle size={16} />
                  ) : task.status == "In Progress" ? (
                    <Timer size={17} />
                  ) : (
                    <CircleCheckBig size={16} />
                  )}
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </TableCell>
                <TableCell className="text-center">
                  {task.user_create.name}
                </TableCell>
                <TableCell className="text-center">
                  {task.user ? (
                    task.user.name
                  ) : (
                    <i className="text-red-400">Unassigned</i>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Dialog
                        open={openEditId === task.id}
                        onOpenChange={(o) => setOpenEditId(o ? task.id : null)}
                      >
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <TaskModal
                          mode="edit"
                          initialData={{
                            projectId: task.project_id,
                            title: task.title,
                            status: task.status,
                          }}
                          onSubmit={(data) => handleEditTask(task.id, data)}
                        />
                      </Dialog>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedTask(task.id);
                          setOpenAssign(true);
                        }}
                      >
                        Assign User
                      </DropdownMenuItem>
                      {selectedTask && (
                        <AssignUserModal
                          open={openAssign}
                          onClose={() => setOpenAssign(false)}
                          users={joinedUsers}
                          initialUserId={task.assigned_to}
                          assignedUser={
                            task.assigned_to
                              ? {
                                  id: task.assigned_to,
                                  name: task.user,
                                }
                              : null
                          }
                          onSubmit={async (userId) => {
                            await TaskService.assignUser(task.id, userId);
                            const refreshed = await TaskService.getTaskById(
                              Number(id)
                            );
                            setTasks(refreshed);
                          }}
                        />
                      )}
                      <DropdownMenuSeparator />
                      {user?.role === "admin" && (
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No work yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default Task;
