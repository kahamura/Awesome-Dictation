import React, { useState, useEffect } from "react";
import "./App.css";

interface Caption {
  textContent: string;
  words: string[][];
}

const App: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const videoElement = document.getElementsByClassName("video-stream")[0];

  useEffect(() => {
    const captionContainerElement = document.getElementsByClassName(
      "ytp-caption-window-container"
    )[0];

    const observer = new MutationObserver(() => {
      const textContent =
        captionContainerElement.textContent?.replace(/^- *|-/g, "") ?? "";

      setCaptions((c) => {
        return [
          ...c,
          {
            textContent,
            words: textContent.split(" ").map((w) => w.split("")),
          },
        ];
      });

      (videoElement as HTMLVideoElement).pause();
    });

    observer.observe(captionContainerElement, { childList: true });

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
    const currentInputContainer =
      document.getElementsByClassName("input-container")[wordIndex];

    if (value.toLowerCase() !== correctAnswer.toLowerCase()) {
      (
        currentInputContainer.children.item(letterIndex) as HTMLInputElement
      ).value = "";
      return;
    }

    // 単語の最後の文字だったら、次の単語の先頭にフォーカスする
    if (
      currentInputContainer.getElementsByTagName("input").length ===
      letterIndex + 1
    ) {
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

  const currentCaption = captions[currentIndex];

  return (
    <div className="card">
      <form className="form">
        {currentCaption?.words?.map((word, wordIndex) => (
          <div key={wordIndex} className="input-container">
            {word.map((letter, letterIndex) => {
              if (/[.,-]/.test(letter)) {
                return (
                  <span
                    key={`${currentIndex}-${wordIndex}-${letterIndex}`}
                    className="text"
                  >
                    {letter}
                  </span>
                );
              }
              return (
                <input
                  key={`${currentIndex}-${wordIndex}-${letterIndex}`}
                  className="input"
                  maxLength={1}
                  onChange={(event) =>
                    onInput(event.target.value, letter, wordIndex, letterIndex)
                  }
                />
              );
            })}
          </div>
        ))}
      </form>
    </div>
  );
};

export default App;
