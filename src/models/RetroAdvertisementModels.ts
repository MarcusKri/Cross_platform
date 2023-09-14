export interface IRetroAdvertisement {
  id: number;
  heading: string;
  description: string;
  category: string;
  price: number;
  hashtags: string[];
  map: string;
  image: {
    id: string;
  },
  date_created_func: {
    day: number;
    month: number;
    year: number;
  },
  user_created: {
    first_name: string;
    email: string;
  },
  users_me: {
    first_name: string;
    email: string;
  }
}

export interface IRetroAdvertisementResponse {
  retro_advertisements_by_id: IRetroAdvertisement;
  
}

export interface IRetroAdvertisementsResponse {
  users_me: IRetroAdvertisement[];
  retro_advertisements: IRetroAdvertisement[];
}

export interface INewRetroAdvertisement {
  heading: string;
  description: string;
  price: number;
  hashtags: string[];
  image: string;
  map: string;
  category: string;
}
