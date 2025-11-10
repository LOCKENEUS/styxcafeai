import React from 'react';

const PlayButton = () => {
  return (
    <>
      <style>{`
        .play-button {
          width: 13vmin;
          height: 5vmin;
          background: #2b6ea1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4vmin;
          box-shadow: 0 1px 0 1px #0002, 0 0.3vmin 0 0 #1f5176, 0 0.6vmin 0 0 #1f5176, 0 0.6vmin 0 1px #0004, 0 -1px 0 1px #0002, 0 calc(0.6vmin + 1px) 2px #fff6;
          transition: all 0.5s ease 0s;
        }

        .play-button:hover {
          transform: translateY(2px);
          box-shadow:
            0 1px 0 1px #0002,
            0 calc(0.3vmin - 2px) 0 0 #2c4050,
            0 calc(0.6vmin - 2px) 0 0 #2c4050,
            0 calc(0.6vmin - 2px) 0 1px #0004,
            0 -1px 0 1px #0002,
            0 calc(0.6vmin - 1px) 3px #fff6;
        }

        .play-button .letter-p {
          border-left: 0.4vmin solid var(--clip);
          height: 2.4vmin;
          border-radius: 0.2vmin;
          position: relative;
        }

        .play-button .letter-p:before {
          content: "";
          border: 0.4vmin solid var(--clip);
          border-color: var(--clip) var(--clip) var(--clip) #fff0;
          width: 1.3vmin;
          height: 0.8vmin;
          margin-left: -0.4vmin;
          position: absolute;
          border-radius: 10% 50% 50% 0 / 10% 50% 50% 10%;
        }

        .play-button .letter-l {
          border-left: 0.4vmin solid var(--clip);
          border-bottom: 0.4vmin solid var(--clip);
          height: 1.8vmin;
          width: 1.2vmin;
          margin-top: 0.2vmin;
          margin-left: 2.2vmin;
          margin-right: 0.9vmin;
          border-radius: 0 0 0 0.2vmin;
          position: relative;
        }

        .play-button .letter-l:before,
        .play-button .letter-l:after {
          content: "";
          background: var(--clip);
          width: 0.4vmin;
          height: 0.4vmin;
          position: absolute;
          border-radius: 100%;
          left: -0.38vmin;
          margin-top: -0.26vmin;
        }

        .play-button .letter-l:after {
          left: 1vmin;
          margin-top: 1.78vmin;
        }

        .play-button .letter-a {
          height: 2.5vmin;
          width: 2.5vmin;
          border-radius: 0.2vmin;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .play-button .letter-a:before,
        .play-button .letter-a:after {
          content: "";
          border-left: 0.4vmin solid var(--clip);
          height: 2.8vmin;
          border-radius: 0.2vmin;
          transform: rotate(25deg);
          position: absolute;
          transform-origin: center 0.1vmin;
        }

        .play-button .letter-a:after {
          transform: rotate(-25deg);
        }

        .play-button .letter-a span {
          border-bottom: 0.4vmin solid var(--clip);
          width: 1.8vmin;
          margin-top: 1.1vmin;
          border-radius: 0.2vmin;
          position: absolute;
        }

        .play-button .letter-y {
          border-left: 0.4vmin solid var(--clip);
          height: 0.9vmin;
          margin-top: 1.5vmin;
          margin-left: 1vmin;
          border-radius: 0.2vmin;
          position: relative;
        }

        .play-button .letter-y:before,
        .play-button .letter-y:after {
          content: "";
          border-left: 0.4vmin solid var(--clip);
          height: 2.3vmin;
          margin-top: 0.2vmin;
          margin-left: -0.4vmin;
          border-radius: 0.2vmin;
          transform: rotate(155deg);
          position: absolute;
          transform-origin: center top;
        }

        .play-button .letter-y:after {
          transform: rotate(205deg);
        }

        .play-button input { display: none; }

        .play-button label {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: 100%;
          height: 100%;
          padding-right: 0.4vmin;
        }

        .play-button input:checked + label .letter-a,
        .play-button label:hover .letter-a {
          transform: rotate(90deg);
          transform-origin: center center;
        }

        .play-button input:checked + label .letter-a span,
        .play-button label:hover .letter-a span {
          margin-top: 2vmin;
          width: 2.3vmin;
        }

        .play-button input:checked + label .letter-p,
        .play-button input:checked + label .letter-l,
        .play-button input:checked + label .letter-y {
          opacity: 0.15;
        }

        .play-button input:checked + label {
          box-shadow: 0 0 1.5vmin 0.4vmin #009be1;
          border-radius: 4vmin;
          background: #03A9F4cc;
          animation: click-btn 0.25s ease 0s 1;
        }

        @keyframes click-btn {
          33% { transform: translateY(0px); }
          66% { transform: translateY(2px); }
          100% { transform: translateY(0px); }
        }

        @media (max-width: 768px) {
          .play-button {
            width: 25vmin;
            height: 8vmin;
          }
        }
      `}</style>

      <div className="play-button">
        <input type="checkbox" id="play" />
        <label htmlFor="play">
          <div className="letter-p" style={{ '--clip': '#e6e6e6' }}></div>
          <div className="letter-l" style={{ '--clip': '#e6e6e6' }}></div>
          <div className="letter-a" style={{ '--clip': '#e6e6e6' }}><span></span></div>
          <div className="letter-y" style={{ '--clip': '#e6e6e6' }}></div>
        </label>
      </div>
    </>
  );
};

export default PlayButton;
