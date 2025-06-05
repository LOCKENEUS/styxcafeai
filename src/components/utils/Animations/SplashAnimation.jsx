// SplashAnimation.jsx
import React, { useEffect } from "react";
import "./SplashAnimation.css"; // CSS below goes here
import { useNavigate } from "react-router-dom";

const texts = ["W", "e", "l", "c", "o", "m", "e", ": )"];
const number_of_particle = 12;

const SplashAnimation = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/admin/dashboard");
    }, 5000); // Show splash for 4 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-wrapper">
      {texts.map((_, i) => (
        <div key={i} className={`background background${i}`}></div>
      ))}

      <div className="criterion">
        {texts.map((t, i) => (
          <div key={`text-${i}`} className={`text text${i}`}>{t}</div>
        ))}

        {texts.map((_, i) => (
          <div key={`frame-${i}`} className={`frame frame${i}`}></div>
        ))}

        {texts.map((_, i) => (
          Array.from({ length: number_of_particle }, (_, j) => (
            <div key={`p-${i}-${j}`} className={`particle particle${i}${j}`}></div>
          ))
        ))}
      </div>
    </div>
  );
};

export default SplashAnimation;
