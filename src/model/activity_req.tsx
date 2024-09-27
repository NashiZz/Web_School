import { Timestamp } from "firebase/firestore";
export interface activityRequestModel {
    body: string;
    img: string;
    title: string;
    url_drive_img: string;
    date_activity: Timestamp;
    create_at: Timestamp;
  }