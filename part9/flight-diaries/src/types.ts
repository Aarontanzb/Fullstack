export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy'
}

export type Visibility = 'great' | 'good' | 'ok' | 'poor';

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
