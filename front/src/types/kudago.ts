export interface KudaEvent {
  dates: {
    start: number;
    end: number;
  }[];
  description: string;
  id: number;
  images: {
    image: string;
    source: {
      link: string;
      name: string;
    };
  }[];
  place: { id: string };
  price: string;
  short_title: string;
  site_url: string;
  title: string;
}

export interface KudaEventsList {
  count: number;
  next: string | null;
  previous: string | null;
  results: KudaEvent[];
}

//type test = T extends string ? string : number;
