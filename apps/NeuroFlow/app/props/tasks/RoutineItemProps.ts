import {Routine} from "../../models";

export interface RoutineItemProps {
    routine: Routine
    onToggleActive: (active: boolean) => void
    onEdit: () => void
    onDelete: () => void
}
