export type SummarizeResponse = {
    title: string;
    tags: string[];
    summary: string;
    actionItems: string[];
  };
  
  export type SummarizeRequest = {
    note: string;
  };
  
  export type NoteListItem = {
    id: number;
    createdAt: string;
    title: string;
  };
  
  export type NoteRecord = {
    id: number;
    createdAt: string;
    note: string;
    title: string;
    tags: string[];
    summary: string;
    actionItems: string[];
  };
  