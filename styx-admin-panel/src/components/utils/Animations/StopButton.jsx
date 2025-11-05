import React from 'react';

const StopButton = () => {
    return (
        <>
            <style>{`
        .stop-button {
          width: 13vmin;
          height: 5vmin;
          background: #c62828;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4vmin;
          box-shadow: 0 1px 0 1px #0002, 0 0.3vmin 0 0 #992222, 0 0.6vmin 0 0 #992222, 0 0.6vmin 0 1px #0004, 0 -1px 0 1px #0002, 0 calc(0.6vmin + 1px) 2px #fff6;
          transition: all 0.5s ease 0s;
        }

        .stop-button:hover {
          transform: translateY(2px);
          box-shadow: 0 1px 0 1px #0002,
            0 calc(0.3vmin - 2px) 0 0 #802020,
            0 calc(0.6vmin - 2px) 0 0 #802020,
            0 calc(0.6vmin - 2px) 0 1px #0004,
            0 -1px 0 1px #0002,
            0 calc(0.6vmin - 1px) 3px #fff6;
        }

        .letter {
          position: relative;
          --clip: #e6e6e6;
        }

        // .letter-s {
        //   width: 2.4vmin;
        //   height: 2.4vmin;
        //   border-radius: 50%;
        //   border: 0.4vmin solid var(--clip);
        //   border-right: none;
        //   border-bottom: none;
        //   transform: rotate(-20deg);
        //   margin-right: 0.3vmin;
        // }

        .letter-s {
  position: relative;
  width: 2vmin;
  height: 2.6vmin;
  margin-right: 0.6vmin;
}

.letter-s::before,
.letter-s::after {
  content: '';
  position: absolute;
  width: 1.4vmin;
  height: 1.4vmin;
  border: 0.4vmin solid var(--clip);
  border-radius: 50%;
}

.letter-s::before {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  transform: rotate(15deg);
}

.letter-s::after {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  transform: rotate(15deg);
}

.letter-s .middle {
  position: absolute;
  top: 1.2vmin;
  left: 0.3vmin;
  width: 1.4vmin;
  height: 0.4vmin;
  background: var(--clip);
  border-radius: 0.2vmin;
}


        .letter-t {
          width: 0.4vmin;
          height: 2.5vmin;
          background: var(--clip);
          position: relative;
          margin-right: 1vmin;
        }

        .letter-t::before {
          content: '';
          width: 1.5vmin;
          height: 0.4vmin;
          background: var(--clip);
          position: absolute;
          top: 0;
          left: -0.55vmin;
          border-radius: 0.2vmin;
        }

        .letter-o {
          width: 1.8vmin;
          height: 1.8vmin;
          border: 0.4vmin solid var(--clip);
          border-radius: 50%;
          margin-right: 1vmin;
        }

        .letter-p {
          border-left: 0.4vmin solid var(--clip);
          height: 2.4vmin;
          border-radius: 0.2vmin;
          position: relative;
        }

        .letter-p::before {
          content: "";
          border: 0.4vmin solid var(--clip);
          border-color: var(--clip) var(--clip) var(--clip) #fff0;
          width: 1.3vmin;
          height: 0.8vmin;
          margin-left: -0.4vmin;
          position: absolute;
          border-radius: 10% 50% 50% 0 / 10% 50% 50% 10%;
        }

        input { display: none; }

        label {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: 100%;
          height: 100%;
          padding-right: 0.4vmin;
        }

        input:checked + label .letter {
          opacity: 0.15;
        }

        input:checked + label {
          background: #ff5252cc;
          box-shadow: 0 0 1.5vmin 0.4vmin #ff1744;
          border-radius: 4vmin;
          animation: click-btn 0.25s ease 0s 1;
        }

        @keyframes click-btn {
          33% { transform: translateY(0px); }
          66% { transform: translateY(2px); }
          100% { transform: translateY(0px); }
        }

      @media (max-width: 768px) {
          .stop-button {
            width: 25vmin;
            height: 8vmin;
          }
        }
      `}</style>

            <div className="stop-button">
                <input type="checkbox" id="stop" />
                <label htmlFor="stop">
                    <div className="letter letter-s">
                        <div className="middle"></div>
                    </div>
                    <div className="letter letter-t"></div>
                    <div className="letter letter-o"></div>
                    <div className="letter letter-p"></div>
                </label>
            </div>
        </>
    );
};

export default StopButton;