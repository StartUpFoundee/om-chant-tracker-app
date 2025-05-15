
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUserJourneyMilestones, Milestone } from "@/lib/spiritual-journey";
import { Award, Star } from "lucide-react";

interface MilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MilestoneModal({ open, onOpenChange }: MilestoneModalProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedTab, setSelectedTab] = useState<"all" | "achieved" | "upcoming">("all");

  useEffect(() => {
    if (open) {
      setMilestones(getUserJourneyMilestones());
    }
  }, [open]);

  const filteredMilestones = milestones.filter(milestone => {
    if (selectedTab === "achieved") return milestone.isAchieved;
    if (selectedTab === "upcoming") return !milestone.isAchieved;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-spiritual-gold" />
            Spiritual Journey
          </DialogTitle>
          <DialogDescription>
            Track your progress on the path of spiritual growth through consistent practice.
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 mb-4">
          <Button
            variant={selectedTab === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("all")}
          >
            All
          </Button>
          <Button
            variant={selectedTab === "achieved" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("achieved")}
          >
            Achieved
          </Button>
          <Button
            variant={selectedTab === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("upcoming")}
          >
            Upcoming
          </Button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {filteredMilestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-3 rounded-md border ${
                milestone.isAchieved
                  ? "border-spiritual-gold/50 bg-spiritual-gold/10"
                  : "border-border"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium flex items-center gap-1">
                  {milestone.isAchieved && (
                    <Star className="h-4 w-4 fill-spiritual-gold text-spiritual-gold" />
                  )}
                  {milestone.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {milestone.progress}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {milestone.description}
              </p>
              <Progress value={milestone.progress} className="h-1.5 mt-2" />
            </div>
          ))}

          {filteredMilestones.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No milestones found in this category.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
