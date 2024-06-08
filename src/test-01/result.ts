import { AxiosInstance } from 'axios';

export interface DocumentProjectRow {
    content: ProjectRow;
    storeVersion: number;
    docTypeVersion: number;
    docId: string;
    docType: string;
}

export interface MemberLabel {
    id: string;
    fullName: string;
    expertise?: string;
}

export interface ProjectRow {
    id: string;
    title: string;
    owners: MemberLabel[];
}

export interface Comment {
    author: MemberLabel;
    text: string;
}

export interface DocumentProject {
    content: Project;
    storeVersion: number;
    docTypeVersion: number;
    docId: string;
    docType: string;
}

export interface PointListSection {
    title: string;
    type: string;
    points: string[];
}

export interface Project {
    id: string;
    owners: MemberLabel[];
    versions: ProjectVersion[];
}

export interface ProjectVersion {
    title: string;
    sections: (PointListSection | TextSection)[];
    comments: Comment[];
}

// export type Section = PointListSection | TextSection;

export interface TextSection {
    title: string;
    type: string;
    text?: string;
}

export const projects = (client: AxiosInstance) => {
    return client.get(`/projects`);
}

export const projectsId = (client: AxiosInstance, id: string) => {
    return client.get(`/projects/${id}`);
}

export const projectsAdminPopulate = (client: AxiosInstance) => {
    return client.get(`/projects/admin/populate`);
}

export const projectsAdminBackup = (client: AxiosInstance) => {
    return client.get(`/projects/admin/backup`);
}
