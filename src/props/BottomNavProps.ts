import { ViewType } from "@/types/ViewType";

export interface BottomNavProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}
