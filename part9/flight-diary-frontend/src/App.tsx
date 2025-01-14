enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Stormy = "stormy",
  Windy = "windy",
}

enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor",
}

interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, "id">;

import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDiary, setNewDiary] = useState<NewDiaryEntry>({
    date: "",
    weather: Weather.Sunny,
    visibility: Visibility.Great,
    comment: "",
  });

  useEffect(() => {
    axios.get<DiaryEntry[]>("/api/diaries").then((response) => {
      setDiaries(response.data);
    });
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setNewDiary({
      ...newDiary,
      [name]: value,
    });
  };

  const addDiaryEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post<DiaryEntry>("/api/diaries", newDiary);
      setDiaries(diaries.concat(response.data));
      setNewDiary({
        date: "",
        weather: Weather.Sunny,
        visibility: Visibility.Great,
        comment: "",
      });
    } catch (error) {
      console.error("Error adding diary entry:", error);
    }
  };

  return (
    <div>
      <h1>Flight Diaries</h1>
      <form onSubmit={addDiaryEntry}>
        <div>
          <label>
            <strong>Date: </strong>
            <input
              type="date"
              name="date"
              value={newDiary.date}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <strong>Weather: </strong>
          {Object.values(Weather).map((weather) => (
            <label key={weather} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="weather"
                value={weather}
                checked={newDiary.weather === weather}
                onChange={handleInputChange}
              />
              {weather}
            </label>
          ))}
        </div>
        <div>
          <strong>Visibility: </strong>
          {Object.values(Visibility).map((visibility) => (
            <label key={visibility} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="visibility"
                value={visibility}
                checked={newDiary.visibility === visibility}
                onChange={handleInputChange}
              />
              {visibility}
            </label>
          ))}
        </div>
        <div>
          <label>
            <strong>Comment: </strong>
            <input
              type="text"
              name="comment"
              value={newDiary.comment}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <button type="submit">Add</button>
      </form>
      <h2>Diary Entries</h2>
      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            <strong>Date:</strong> {diary.date} | <strong>Weather:</strong>{" "}
            {diary.weather} | <strong>Visibility:</strong> {diary.visibility} |{" "}
            <strong>Comment:</strong> {diary.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
