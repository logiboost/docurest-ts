import { AxiosInstance } from 'axios';

export interface RevisionUnitV0 {
    transcripts: { [key: string]: TranscriptV0 };
    audioDuration?: number;
    marked: boolean;
    title?: string;
    notes?: string;
    audioRevisionEnabled: boolean;
    sufficientExerciseCoverage: boolean;
}

export interface TranscriptV0 {
    bodies: string[];
    listen: boolean;
    repeatMode: 'DISABLED' | 'LISTEN_ONLY' | 'LISTEN_AND_REPEAT';
    recallMode: 'DISABLED' | 'RECALL' | 'LISTEN_ONLY';
}

export interface DocumentRevisionUnitV0 {
    content: RevisionUnitV0;
    storeVersion: number;
    docType: string;
    docId: string;
    docTypeVersion: number;
}

export interface ReceiveAudioAction {

}

export interface InsertRevisionUnitAction {
    languages: string;
}

export interface GenerateAudioAction {

}

export interface And {
    filterType: 'AND';
    leftMember?: Filter;
    rightMember?: Filter;
}

export interface BooleanValue {
    leafType: 'BOOLEAN';
    filterType: 'BOOLEAN';
    value?: boolean;
}

export interface Eq {
    filterType: 'EQ';
    leftMember?: Leaf;
    rightMember?: Leaf;
}

export interface Field {
    leafType: 'FIELD';
    path?: string;
}

export type Filter = And | Eq | BooleanValue;

export type Leaf = StringValue | Field | BooleanValue;

export interface StringValue {
    leafType: 'STRING';
    value?: string;
}

export interface GenerateAllAudioAction {

}

export const revisionUnitsIdUpdate = (client: AxiosInstance, id: string, body: RevisionUnitV0) => {
    return client.post(`/revisionUnits/${id}/update`, body);
}

export const revisionUnitsIdReceiveaudio = (client: AxiosInstance, id: string, body: ReceiveAudioAction) => {
    return client.post(`/revisionUnits/${id}/receiveAudio`, body);
}

export const revisionUnitsIdInsert = (client: AxiosInstance, id: string, body: InsertRevisionUnitAction) => {
    return client.post(`/revisionUnits/${id}/insert`, body);
}

export const revisionUnitsIdGenerateproducts = (client: AxiosInstance, id: string, body: GenerateAudioAction) => {
    return client.post(`/revisionUnits/${id}/generateProducts`, body);
}

export const revisionUnitsSelect = (client: AxiosInstance, body: (And | BooleanValue | Eq)) => {
    return client.post(`/revisionUnits/select`, body);
}

export const revisionUnitsGenerateproducts = (client: AxiosInstance, body: GenerateAllAudioAction) => {
    return client.post(`/revisionUnits/generateProducts`, body);
}

export const revisionUnits = (client: AxiosInstance) => {
    return client.get(`/revisionUnits`);
}

export const revisionUnitsId = (client: AxiosInstance, id: string) => {
    return client.get(`/revisionUnits/${id}`);
}

export const revisionUnitsAdminPopulateConfirm = (client: AxiosInstance, confirm: boolean) => {
    return client.get(`/revisionUnits/admin/populate/${confirm}`);
}

export const revisionUnitsAdminBackup = (client: AxiosInstance) => {
    return client.get(`/revisionUnits/admin/backup`);
}
