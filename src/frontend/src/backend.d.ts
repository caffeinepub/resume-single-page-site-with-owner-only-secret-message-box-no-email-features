import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Certification {
    name: string;
    year: bigint;
    issuer: string;
}
export type Time = bigint;
export interface Content {
    projects: Array<Project>;
    education: Array<EducationEntry>;
    heroText: string;
    experience: Array<ExperienceItem>;
    certifications: Array<Certification>;
    skills: Array<string>;
    hobbies: Array<string>;
}
export interface RecruiterVisit {
    timestamp: Time;
    companyName?: string;
}
export interface VisitorMessage {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export interface ExperienceItem {
    duration: string;
    description: string;
    company: string;
    position: string;
}
export interface Project {
    title: string;
    link: string;
    description: string;
    details: string;
}
export interface EducationEntry {
    institution: string;
    year: bigint;
    degree: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearRecruiterVisits(password: string): Promise<void>;
    clearVisitorMessages(password: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContent(): Promise<Content>;
    getRecruiterVisits(password: string): Promise<Array<RecruiterVisit>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorMessages(password: string): Promise<Array<VisitorMessage>>;
    isCallerAdmin(): Promise<boolean>;
    logRecruiterVisit(isRecruiter: boolean, companyName: string | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitVisitorMessage(name: string, email: string, message: string): Promise<void>;
    updateContent(newContent: Content, password: string): Promise<void>;
}
