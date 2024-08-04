export interface JobListing {
  position: string;
  company: string;
  location: string;
  date: string;
  salary: string;
  jobUrl: string;
}

export interface QueryParams {
  keyword?: string;
  location?: string;
}
