"use client";

import { useState } from "react";
import { updateAIPlanChecklist, updateAIPlanChecklistBulk } from "@/actions/aiPlanActions";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Loader2, ListTodo, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChecklistItem {
  task: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface ChecklistManagerProps {
  planId: string;
  checklist: ChecklistItem[];
  onUpdate?: () => void;
}

export function ChecklistManager({ planId, checklist, onUpdate }: ChecklistManagerProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>(checklist);
  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleToggle = async (index: number) => {
    const current = items[index];
    const newVal = !current.completed;

    // Optimistic update
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, completed: newVal } : item))
    );

    setUpdatingIndex(index);
    try {
      const result = await updateAIPlanChecklist(planId, index, newVal);
      if (result.success) {
        onUpdate?.();
      } else {
        // Revert on failure
        setItems((prev) =>
          prev.map((item, i) => (i === index ? { ...item, completed: !newVal } : item))
        );
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update checklist item",
        variant: "destructive",
      });
    } finally {
      setUpdatingIndex(null);
    }
  };

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    setIsAdding(true);
    try {
      const newItem = { task: newTask.trim(), completed: false, priority: newPriority };
      const updatedItems = [...items, newItem];

      // We update the entire checklist since Sanity patch doesn't support array append with nested objects easily
      const result = await updateAIPlanChecklistBulk(planId, updatedItems);
      if (result.success) {
        setItems(updatedItems);
        setNewTask("");
        setNewPriority("medium");
        setAddDialogOpen(false);
        onUpdate?.();
        toast({
          title: "Task added",
          description: `"${newItem.task}" has been added to the checklist.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (index: number) => {
    const removed = items[index];
    const updatedItems = items.filter((_, i) => i !== index);

    setItems(updatedItems);
    try {
      const result = await updateAIPlanChecklistBulk(planId, updatedItems);
      if (result.success) {
        onUpdate?.();
        toast({
          title: "Task removed",
          description: `"${removed.task}" has been removed.`,
        });
      } else {
        setItems(items); // Revert
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove task",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-purple-600" />
          Planning Checklist
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAddDialogOpen(true)}
          className="gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 p-4 rounded-xl bg-chart-3/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Progress
          </span>
          <span className="text-sm font-bold text-muted-foreground">
            {completedCount}/{items.length} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-chart-3/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-chart-3 to-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all group"
          >
            <button
              onClick={() => handleToggle(index)}
              disabled={updatingIndex === index}
              className="flex-shrink-0 disabled:opacity-50"
            >
              {updatingIndex === index ? (
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              ) : item.completed ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/50 hover:text-chart-3 transition-colors" />
              )}
            </button>
            <span
              className={`flex-1 ${item.completed ? "line-through text-muted-foreground" : ""
                }`}
            >
              {item.task}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${item.priority === "high"
                  ? "bg-danger-muted text-danger"
                  : item.priority === "medium"
                    ? "bg-warning-muted text-warning"
                    : "bg-muted text-muted-foreground"
                }`}
            >
              {item.priority}
            </span>
            <button
              onClick={() => handleDelete(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Checklist Task</DialogTitle>
            <DialogDescription>
              Add a new task to your planning checklist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Task description..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select
                value={newPriority}
                onValueChange={(v: "high" | "medium" | "low") => setNewPriority(v)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={isAdding}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={isAdding || !newTask.trim()}
              className="gap-2 rounded-xl"
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Task
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
