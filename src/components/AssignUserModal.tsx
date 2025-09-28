import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface AssignUserModalProps {
  open: boolean;
  onClose: () => void;
  users: { id: number; name: string }[];
  assignedUser?: { id: number; name: string }[];
  initialUserId: number
  onSubmit: (userId: number) => void;
}

export default function AssignUserModal({
  open,
  onClose,
  users = [],
  assignedUser = [],
  initialUserId,
  onSubmit,
}: AssignUserModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    initialUserId ? String(initialUserId) : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      onSubmit(Number(selectedUserId));
      onClose();
    }
  };
  
  console.log(assignedUser);
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign User</DialogTitle>
        </DialogHeader>

        {/* Select User */}
        <form onSubmit={handleSubmit} className="space-y-4">
        <Select value={selectedUserId} onValueChange={(val) => setSelectedUserId(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih user" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {users.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="mt-3 w-full"
        >
          Assign
        </Button>

        {/* List Assigned Users */}
        {/* <div className="mt-4">
          <h3 className="font-semibold mb-2">Assigned Users:</h3>
          <ul className="space-y-1">
            {assignedUser ? (
              <li className="text-sm text-gray-700 outline-2 w-">
                {assignedUser.name.name ? assignedUser.name.name : "Refresh"}
              </li>
            ) : (
              <p className="text-sm text-gray-500">
                Belum ada user yang di-assign
              </p>
            )}
          </ul>
        </div> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
