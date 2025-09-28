import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ProjectFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface ProjectModalProps {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: ProjectFormData;
  mode?: "add" | "edit";
}

export function ProjectModal({
  onSubmit,
  initialData,
  mode = "add",
}: ProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState  ("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  

    useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
      setStartDate(initialData.start_date)
      setEndDate(initialData.end_date)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, start_date: startDate, end_date: endDate });
    if (mode === "add") {
      setTitle("")
      setDescription("")
      setStartDate("")
      setEndDate("")
    }
  };

  
  return (
    <>
    <DialogContent className="sm:max-w-md bg-white shadow-lg" >
      <DialogHeader>
        <DialogTitle>
          {mode == "add" ? "Tambah Project" : "Edit Project"}  
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="mb-2">
            Title
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
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_date" className="mb-2">
              Start Date
            </Label>
            <Input
              id="start_date"
              type="date"
              value={startDate.slice(0, 10)}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="end_date" className="mb-2">
              End Date
            </Label>
            <Input
              id="end_date"
              type="date"
              value={endDate.slice(0, 10)}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          {mode === "add" ? "Submit" : "Edit"}  
        </Button>
      </form>
    </DialogContent>
    </>
  );
}
