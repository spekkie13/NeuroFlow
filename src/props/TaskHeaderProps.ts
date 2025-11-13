import {Project} from "@/app/utils/types";

export interface TaskHeaderProps {
    project: Project;
    focusMode: boolean;
    onToggleFocus: () => void;
    allProjects?: Project[];
    onSelectProject?: (projectId: string) => void;
}
