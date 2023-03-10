import { useState, useEffect } from 'react';
import {
  NonSensitiveDiaryEntry,
  NewDiaryEntry,
  Visibility,
  Weather
} from './types';
import { getallDiaries, createDiary } from './diaryService';
import { isAxiosError } from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('2023-01-01');
  const [visibility, setVisibility] = useState<Visibility | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [comment, setComment] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
  }

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!visibility || !weather) {
      notify('Visibility or weather missing');
      return;
    }

    const diaryToAdd: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment
    };

    createDiary(diaryToAdd)
      .then((data) => {
        setDiaries(diaries.concat(data));
        setDate('');
        setVisibility(null);
        setWeather(null);
        setComment('');
      })
      .catch((error) => {
        if (isAxiosError<ValidationError, Record<string, unknown>>(error)) {
          notify(error.message);
        } else {
          notify('unknown error');
        }
      });
  };

  useEffect(() => {
    getallDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  return (
    <div>
      <h3>Add new entry</h3>
      <h4 style={{ color: 'red', marginBottom: 10 }}>{notification}</h4>
      <form onSubmit={diaryCreation}>
        <div>
          date
          <input
            type="date"
            id="start"
            name="trip-start"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            min="2021-01-01"
            max="2025-12-31"
          />
        </div>
        <div>
          visibility great
          <input
            type="radio"
            name="visibility"
            onChange={() => setVisibility(Visibility.Great)}
          />
          good
          <input
            type="radio"
            name="visibility"
            onChange={() => setVisibility(Visibility.Good)}
          />
          ok
          <input
            type="radio"
            name="visibility"
            onChange={() => setVisibility(Visibility.Ok)}
          />
          poor
          <input
            type="radio"
            name="visibility"
            onChange={() => setVisibility(Visibility.Poor)}
          />
        </div>
        <div>
          weather sunny
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Sunny)}
          />
          rainy
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Rainy)}
          />
          cloudy
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Cloudy)}
          />
          stormy
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Stormy)}
          />
          windy
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Windy)}
          />
        </div>
        <div>
          comment
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
      <h3>Diary entries</h3>{' '}
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h4>{diary.date}</h4>
          <p>visibility: {diary.visibility}</p>
          <p>weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
