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
    contact: ContactDetails;
    projects: Array<Project>;
    education: Array<EducationEntry>;
    heroText: string;
    experience: Array<ExperienceItem>;
    certifications: Array<Certification>;
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
export interface ContactDetails {
    email: string;
    address: string;
    phone: string;
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
    addSkill(skill: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearRecruiterVisits(): Promise<void>;
    clearSkills(): Promise<void>;
    clearVisitorMessages(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContent(): Promise<Content>;
    getRecruiterVisits(): Promise<Array<RecruiterVisit>>;
    getSkills(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorMessages(): Promise<Array<VisitorMessage>>;
    isCallerAdmin(): Promise<boolean>;
    logRecruiterVisit(isRecruiter: boolean, companyName: string | null): Promise<void>;
    removeSkill(skill: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitVisitorMessage(name: string, email: string, message: string): Promise<void>;
    updateContent(newContent: Content): Promise<void>;
}
