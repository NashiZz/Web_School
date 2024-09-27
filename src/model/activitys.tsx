import { Timestamp } from "firebase/firestore";
export interface activityModel {
    id:string;
    body: string;
    img: string;
    title: string;
    url_dive_image: string;
    date_activity: Timestamp;
    create_at: Timestamp;
  }