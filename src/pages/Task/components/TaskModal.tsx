import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TaskFormData {
  projectId: string;
  title: string;
  status: string;
  created_by: number;
}

interface TaskModalProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: TaskFormData;
  mode?: "add" | "edit";
}

export function TaskModal({
  onSubmit,
  initialData,
  mode = "add",
}: TaskModalProps) {
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (initialData) {
      setProjectId(initialData.projectId);
      setTitle(initialData.title);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const initialStatus = [
    { status: "Todo", name: "Todo" },
    { status: "In Progress", name: "In Progress" },
    { status: "Done", name: "Done" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      title,
      status,
      created_by: initialData?.created_by ?? 0,
    });
    setProjectId("");
    setTitle("");
    setStatus("");
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {mode === "add" ? "Tambah Task" : "Edit Task"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="mb-2">
            Task
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description" className="mb-2">
            Status
          </Label>
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                {initialStatus.map((item, index) => (
                  <SelectItem key={index} value={item.status}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          {mode === "add" ? "Tambah Task" : "Edit Task"}
        </Button>
      </form>
    </DialogContent>
  );
}
