import React, { useState, useRef, useEffect } from "react";
import data from "./data";
import Section from "./Section";

const multiplyList = (arr, amount) => {
  const newArr = [];
  for (let i = 0; i < amount; i++) {
    newArr.push(...arr);
  }
  return newArr;
};

function App() {
  const [list, setList] = useState(
    multiplyList(data, 3).map((item, idx) => ({ id: idx, item }))
  );
  const [isFinished, setIsFinished] = useState(false);
  const [isRemoved, setIsRemoved] = useState(Date.now());
  const sentinelCollectionRef = useRef(new Map());
  const observerRef = useRef(
    new IntersectionObserver(
      (entries) => {
        const sentinelContainer = sentinelCollectionRef.current;

        entries.forEach((entry) => {
          const { target, intersectionRatio, boundingClientRect } = entry;
          const targetTop = boundingClientRect.top;
          const rootHeight = entry.rootBounds.height;
          const rootTop = entry.rootBounds.top;
          const props = sentinelContainer.get(target);
          const percentage = rootHeight > 700 ? 0.65 : 0.8;

          if (!props) return;

          const { container, setSticky, setShadow } = props;

          const containerHeight = container.getBoundingClientRect().height;

          if (containerHeight > rootHeight * percentage) {
            setSticky(true);
            const nearTop = Math.abs(targetTop - rootTop) <= rootHeight;
            if (
              intersectionRatio === 0 &&
              (nearTop || Math.sign(targetTop) === -1)
            ) {
              setShadow(true);
            } else if (intersectionRatio === 1) {
              setShadow(false);
            }
          } else {
            setSticky(false);
            setShadow(false);
          }
        });
      },
      { threshold: [0, 1] }
    )
  );

  useEffect(() => {
    setIsFinished(true);
  }, [isFinished]);

  // cleanup
  useEffect(() => {
    const observer = observerRef.current;
    const sentinelCollection = sentinelCollectionRef.current;

    return () => {
      observer.disconnect();
      observer = null;
      sentinelCollection.clear();
    };
  }, []);

  const onRemove = (id) => {
    const copy = [...list];
    const foundIdx = list.findIndex((item) => item.id === id);
    copy.splice(foundIdx, 1);
    setList(copy);
  };

  return (
    <div className="App">
      <h1>Sections with IntersectionObserver </h1>
      <div>
        If a section takes more 65% of the viewport, then the header title
        floats
      </div>
      <br />
      <div>If viewport height is less than 700px, it's 80%</div>
      <br />
      <div>
        One Observer watching {sentinelCollectionRef.current.size}{" "}
        {sentinelCollectionRef.current.size - 1 ? "sections" : "section"}
      </div>

      {list.map(({ id, item }) => {
        return (
          <Section
            id={id}
            content={item}
            observer={observerRef.current}
            sentinelCollection={sentinelCollectionRef.current}
            onRemove={onRemove}
            setIsRemoved={setIsRemoved}
            key={id}
          ></Section>
        );
      })}
    </div>
  );
}

export default App;
