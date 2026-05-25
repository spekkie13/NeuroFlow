import {Routine} from "../../models";

export interface RoutineModalProps {
    visible: boolean
    routine?: Routine
    onSave: (routine: Routine) => void
    onClose: () => void
}
