import React from 'react'
import { IoAdd } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const GamePlaceholder = () => {
    return (
        <>
            <div
                className="justify-content-center align-items-center muted-text fs-3 position-relative d-none d-md-flex flex-column"
                style={{
                    width: "24%",
                    paddingTop: "12%",
                    paddingBottom: "12%",
                    borderRadius: "20px",
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        borderRadius: "20px",
                        pointerEvents: "none",
                    }}
                >
                    <rect
                        x="1" y="1"
                        width="calc(100% - 2px)" height="calc(100% - 2px)"
                        rx="20" // Matches border-radius
                        fill="none"
                        stroke="#C4C4C4"
                        strokeWidth="1"
                        strokeDasharray="5, 5" // Adjust these values (dash, gap)
                    />
                </svg>

                <Link to="/admin/games/create-new-game">
                    <IoAdd
                        style={{
                            fontSize: 'clamp(30px, 8vw, 40px)',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            color: 'blue',
                            border: '2px solid blue',
                            borderRadius: '50%',
                            padding: '0.2rem',
                        }}
                    />
                </Link>
                No Games Added Yet
            </div>


            <div
                className="d-flex d-flex flex-column justify-content-center align-items-center muted-text fs-3 position-relative d-block d-md-none"
                style={{
                    width: "70%",
                    paddingTop: "12%",
                    paddingBottom: "12%",
                    borderRadius: "20px",
                }}
            >
                {/* SVG for custom dashed border */}
                <svg
                    width="240px"
                    height="100%" // <- instead of fixed height like 300px
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        borderRadius: "10px",
                        pointerEvents: "none",
                    }}
                >
                    <rect
                        x="1"
                        y="1"
                        width="calc(240px - 2px)"
                        height="calc(100% - 2px)"
                        rx="20"
                        fill="none"
                        stroke="#C4C4C4"
                        strokeWidth="1"
                        strokeDasharray="5, 5"
                    />
                </svg>

                <Link to="/admin/games/create-new-game">
                    <IoAdd
                        style={{
                            fontSize: 'clamp(30px, 8vw, 40px)',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            color: 'blue',
                            border: '2px solid blue',
                            borderRadius: '50%',
                            padding: '0.2rem',
                        }}
                    />
                </Link>
                No Games Added Yet
            </div>
        </>
    )
}

export default GamePlaceholder