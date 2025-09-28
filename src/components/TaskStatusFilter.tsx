import { useState } from "react";
import { CirclePlus, Circle, Timer, CircleCheckBig } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { label: "Todo", icon: Circle },
  { label: "In Progress", icon: Timer },
  { label: "Done", icon: CircleCheckBig },
];

export default function TaskStatusFilter({
  onFilter,
}: {
  onFilter: (status: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleStatus = (status: string) => {
    let newSelected: string[];
    if (selected.includes(status)) {
      newSelected = selected.filter((s) => s !== status);
    } else {
      newSelected = [...selected, status];
    }
    setSelected(newSelected);
    onFilter(newSelected);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <CirclePlus size={18} /> Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {statusOptions.map((status, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={selected.includes(status.label)}
            onCheckedChange={() => toggleStatus(status.label)}
          >
            <status.icon size={18} />
            {status.label.charAt(0).toUpperCase() + status.label.slice(1)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
