export type SummarizeResponse = {
    title: string;
    tags: string[];
    summary: string;
    actionItems: string[];
  };
  
  export type SummarizeRequest = {
    note: string;
  };
  
  