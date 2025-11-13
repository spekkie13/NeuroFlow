import {Project} from "@/app/utils/types";

export interface ProjectListProps {
    projects: Project[];
    selectedProjectId: string | null;
    onSelectProject: (projectId: string) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
}
