import React, { useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [subtitles, setSubtitles] = useState<string | null>();

  const subsElement = document.getElementsByClassName(
    "ytp-caption-window-container"
  )[0];
  const videoElement: any = document.getElementsByClassName("video-stream")[0];

  const observer = new MutationObserver(() => {
    setSubtitles(subsElement.textContent);
    videoElement.pause();
  });

  observer.observe(subsElement, { childList: true });

  const onInputLetter = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.value === subtitles?.[index]) {
      console.log("correct!");

      const form = e.target.form;
      (form?.elements[index + 1] as HTMLInputElement).focus();

      e.preventDefault();
    } else {
      console.log("wrong!");
    }
  };

  return (
    <div className="card-container">
      <form className="form">
        {subtitles?.split("").map((s, i) => (
          <input
            key={i}
            placeholder={s}
            maxLength={1}
            className="input"
            onChange={(e) => onInputLetter(e, i)}
          />
        ))}
      </form>
    </div>
  );
};

export default App;
