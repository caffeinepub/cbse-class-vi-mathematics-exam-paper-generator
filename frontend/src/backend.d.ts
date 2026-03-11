import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Question {
    id: string;
    marks: bigint;
    content: string;
    difficulty: string;
    correctAnswer: string;
    questionType: QuestionType;
    image?: ExternalBlob;
    chapter: bigint;
    options?: Array<string>;
}
export interface QuestionUpdateArgs {
    marks: bigint;
    content: string;
    difficulty: string;
    correctAnswer: string;
    questionType: QuestionType;
    image?: ExternalBlob;
    chapter: bigint;
    options?: Array<string>;
}
export enum QuestionType {
    mcq = "mcq",
    shortAnswer = "shortAnswer",
    longAnswer = "longAnswer",
    imageBased = "imageBased"
}
export interface backendInterface {
    addQuestion(args: QuestionUpdateArgs): Promise<string>;
    deleteQuestion(id: string): Promise<void>;
    getAllQuestions(): Promise<Array<Question>>;
    getQuestionById(id: string): Promise<Question>;
    getQuestionsByChapter(chapter: bigint): Promise<Array<Question>>;
    getQuestionsByChapterAndType(chapter: bigint, qType: QuestionType): Promise<Array<Question>>;
    getQuestionsByType(qType: QuestionType): Promise<Array<Question>>;
    updateQuestion(id: string, args: QuestionUpdateArgs): Promise<void>;
}
