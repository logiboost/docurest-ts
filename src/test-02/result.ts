import { AxiosInstance } from 'axios';

export interface DocumentThing {
    content: Thing;
    docType: string;
    storeVersion: number;
    docTypeVersion: number;
    docId: string;
}

export interface MemberLabel {
    id: string;
    fullName: string;
    expertise?: string;
}

export interface Thing {
    id: string;
    owner: MemberLabel;
    designation: string;
    transcripts?: { [key: string]: MemberLabel };
    shareMode: 'PRIVATE' | 'SHARED_FOR_FREE' | 'FOR_RENT' | 'MUTUALIZED';
}

export interface DocumentThingRow {
    content: ThingRow;
    docType: string;
    storeVersion: number;
    docTypeVersion: number;
    docId: string;
}

export interface ThingRow {
    id: string;
    owner: MemberLabel;
    designation: string;
}

export const thingsId = (client: AxiosInstance, id: string) => {
    return client.get(`/things/${id}`);
}

export const thingsMine = (client: AxiosInstance) => {
    return client.get(`/things/mine`);
}

export const thingsAdminPopulate = (client: AxiosInstance) => {
    return client.get(`/things/admin/populate`);
}

export const thingsAdminBackup = (client: AxiosInstance) => {
    return client.get(`/things/admin/backup`);
}
