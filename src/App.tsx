import React, { useState, useCallback, useMemo, useEffect } from "react";
import "./App.css";

interface Caption {
  index: number;
  textContent: string;
  wordList: string[];
  letterList: string[];
}

const App: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const videoElement = document.getElementsByClassName("video-stream")[0];

  useEffect(() => {
    const subsElement = document.getElementsByClassName(
      "ytp-caption-window-container"
    )[0];

    const observer = new MutationObserver(() => {
      const textContent = subsElement.textContent?.replace(/^- */g, "") ?? "";

      const captionElement = document.getElementsByClassName(
        "caption-window ytp-caption-window-bottom"
      )[0];
      const index = captionElement
        ?.getAttribute("id")
        ?.replace(/^caption-window-_/g, "");

      setCaptions((c) => {
        return [
          ...c,
          {
            index: Number(index),
            textContent,
            wordList: textContent.split(" "),
            letterList: textContent.split(""),
          },
        ];
      });

      (videoElement as HTMLVideoElement).pause();
    });

    observer.observe(subsElement, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const onInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    letter: string,
    letterIndex: number
  ) => {
    if (event.target.value === letter) {
      if (letterIndex === captions[currentIndex].letterList.length - 1) {
        setCurrentIndex(currentIndex + 1);
        (videoElement as HTMLVideoElement).play();
      } else {
        const form = event.target.form;
        (form?.elements[letterIndex + 1] as HTMLInputElement).focus();
        event.preventDefault();
      }
    }
  };

  const currentCaption = captions.find((v) => v.index === currentIndex);
  if (currentCaption == null) {
    return null;
  }

  return (
    <div className="card">
      <form className="form">
        {currentCaption.letterList.map((letter, letterIndex) => (
          <input
            key={`${currentCaption.index}-${letterIndex}`}
            className="input"
            maxLength={1}
            onChange={(event) => onInput(event, letter, letterIndex)}
          />
        ))}
      </form>
    </div>
  );
};

export default App;
