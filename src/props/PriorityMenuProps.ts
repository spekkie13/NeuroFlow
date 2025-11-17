import {Priority} from "@/app/utils/types";

export interface PriorityMenuProps {
    current: Priority;
    onSelect: (p: Priority) => void
}
