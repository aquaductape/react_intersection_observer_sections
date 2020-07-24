import React, { useState, useRef, useEffect } from "react";
import { prefix } from "inline-style-prefixer";

const Section = ({
  id,
  content,
  observer,
  sentinelCollection,
  onRemove,
  setIsRemoved,
}) => {
  const containerRef = useRef(null);
  const sentinelTopRef = useRef(null);
  const [sticky, setSticky] = useState(false);
  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    const sentinelTop = sentinelTopRef.current;
    const container = containerRef.current;

    observer.observe(sentinelTop);
    sentinelCollection.set(sentinelTop, {
      container,
      setSticky,
      setShadow,
    });

    // when component is removed
    return () => {
      console.log("on removed");
      observer.unobserve(sentinelTop);
      sentinelCollection.delete(sentinelTop, {
        container,
        setSticky,
        setShadow,
      });
      setIsRemoved(Date.now());
    };
  }, []);

  const styleHeader = {
    // position: sticky ? "sticky" : "relative",
    // Shadow: casted only bottom, not on all sides
    //      best style if header layout has no left padding
    //      issue: may look strange
    boxShadow: shadow ? "rgba(0, 0, 42, 0.55) 0px 15px 17px -16px" : "none",
    // Shadow: normaly casted, all 4 or 3 sides
    // best style if header layout is static
    // paddingLeft: shadow ? "30px": "0",
  };

  return (
    <section ref={containerRef}>
      <div className="sentinel-top" ref={sentinelTopRef}></div>
      <header className={sticky ? "sticky" : null} style={styleHeader}>
        <h3>Header {id + 1}</h3>{" "}
        <button className="btn-remove" onClick={() => onRemove(id)}>
          Remove
        </button>
      </header>
      <div className="content">{content}</div>
    </section>
  );
};

export default Section;
