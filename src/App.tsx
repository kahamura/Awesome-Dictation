import React, { useState, useEffect } from "react";
import "./App.css";

interface Caption {
  index: number;
  textContent: string;
  words: string[][];
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
            words: textContent.split(" ").map((w) => w.split("")),
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
    value: string,
    correctAnswer: string,
    wordIndex: number,
    letterIndex: number
  ) => {
    if (value !== correctAnswer) {
      return;
    }
    const currentInputContainer =
      document.getElementsByClassName("input-container")[wordIndex];

    // 単語の最後の文字だったら、次の単語の先頭にフォーカスする
    if (currentInputContainer.childElementCount === letterIndex + 1) {
      const nextInputContainer =
        document.getElementsByClassName("input-container")[wordIndex + 1];

      if (nextInputContainer == null) {
        setCurrentIndex(currentIndex + 1);
        (videoElement as HTMLVideoElement).play();
        return;
      }

      (nextInputContainer.children.item(0) as HTMLInputElement)?.focus();
    }
    // 次の入力欄にフォーカスする
    else {
      (
        currentInputContainer.children.item(letterIndex + 1) as HTMLInputElement
      )?.focus();
    }
  };

  useEffect(() => {
    const inputContainer =
      document.getElementsByClassName("input-container")[0];

    (inputContainer?.children?.item(0) as HTMLInputElement)?.focus();
  }, [captions]);

  const currentCaption = captions.find((v) => v.index === currentIndex);
  if (currentCaption == null) {
    return null;
  }
  console.log(currentCaption);

  return (
    <div className="card">
      <form className="form">
        {currentCaption.words.map((word, wordIndex) => (
          <div key={wordIndex} className="input-container">
            {word.map((letter, letterIndex) => (
              <input
                key={`${currentCaption.index}-${wordIndex}-${letterIndex}`}
                className="input"
                maxLength={1}
                onChange={(event) =>
                  onInput(event.target.value, letter, wordIndex, letterIndex)
                }
              />
            ))}
          </div>
        ))}
      </form>
    </div>
  );
};

export default App;
