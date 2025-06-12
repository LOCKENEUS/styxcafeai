import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import solar_export from '/assets/inventory/solar_export-linear.png';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { getGames } from '../../../store/slices/gameSlice';
import { getslots24 } from '../../../store/slices/slotsSlice';
import { getCafeBookingsReport, getCommissionReport } from '../../../store/AdminSlice/reports';
import { useNavigate } from 'react-router-dom';

export const CommissionReport = () => {
    const [activePage, setActivePage] = useState(1);
    const totalPages = 5;
    const navigate = useNavigate();
    let filteredItems = [];
    const columns = [
        {
            name: "SN",
            selector: (row, index) => index + 1,
            csvSelector: (row, index) => index + 1,
            minWidth: "70px",
            maxWidth: "70px",
        },
        {
            name: "Booking ID",
            selector: (row) => row.booking_id,
            csvSelector: (row) => row.booking_id,
            minWidth: "120px",
            sortable: true,
            cell: (row) => (
                <div
                    style={{ color: "#0062FF", cursor: "pointer" }}
                    onClick={() => navigate(`/admin/booking/checkout/${row._id}`)}
                >
                    {row.booking_id}
                </div>
            ),
        },
        {
            name: "Game",
            selector: (row) => row?.game_id?.name || "N/A",
            csvSelector: (row) => row?.game_id?.name || "N/A",
            minWidth: "170px",
            sortable: true,
            cell: (row) => (
                <div
                    style={{ color: "#0062FF", cursor: "pointer" }}
                    onClick={() => navigate(`/admin/games/game-details/${row?.game_id?._id}`)}
                >
                    {row?.game_id?.name}
                </div>
            ),
        },
        {
            name: "Slot",
            selector: (row) =>
                `${row?.slot_id?.start_time || ""} - ${row?.slot_id?.end_time || ""}`,
            csvSelector: (row) =>
                `${row?.slot_id?.start_time || ""} - ${row?.slot_id?.end_time || ""}`,
            minWidth: "120px",
            sortable: true,
        },
        {
            name: "Players",
            selector: (row) => `${(row?.players?.length || 0) + 1} Players`,
            csvSelector: (row) => `${(row?.players?.length || 0) + 1} Players`,
            sortable: true,
        },
        {
            name: "Items",
            selector: (row) => (
                <div>
                    {row?.so_id?.items?.length > 0 ? (
                        row.so_id.items.map((item, index) => (
                            <div key={index}>
                                <span>{item?.item_id?.name || "Unnamed Item"}</span> ({"₹"}{item?.total}) {item?.quantity}{"Nos"}
                            </div>
                        ))
                    ) : (
                        <div className="text-muted">No Items</div>
                    )}
                </div>
            ),
            csvSelector: (row) =>
                row?.so_id?.items?.length > 0
                    ? row.so_id.items.map((item) => item?.item_id?.name || "Unnamed").join(" | ")
                    : "No Items",
            minWidth: "250px",
            sortable: true,
        },
        {
            name: "Credit Amount",
            selector: (row) => (
                <div>
                    {row?.playerCredits?.filter((c) => c?.credit > 0).length > 0 ? (
                        row.playerCredits
                            .filter((credit) => credit?.credit > 0)
                            .map((credit, index) => (
                                <div key={index} className="border-bottom p-2 mb-1">
                                    <div>
                                        <strong>{credit?.id?.name || "Unknown"}:</strong> ₹{credit?.credit}{" "}
                                        <span className='rounded-2' style={{ backgroundColor: credit?.status === "Paid" ? "green" : "red", padding: "5px", borderRadius: "5px", color: "white", fontSize: "10px" }}>{credit?.status || "N/A"}</span>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="text-muted">No Player Credits</div>
                    )}
                </div>
            ),
            csvSelector: (row) =>
                row?.playerCredits?.filter((c) => c?.credit > 0).length > 0
                    ? row.playerCredits
                        .filter((credit) => credit?.credit > 0)
                        .map(
                            (credit) =>
                                `${credit?.id?.name || "Unknown"}: ₹${credit?.credit} (Status: ${credit?.status || "N/A"
                                })`
                        )
                        .join(" | ")
                    : "No Player Credits",
            minWidth: "250px",
            sortable: true,
        },
        {
            name: "Bookin Type",
            selector: (row) => row.booking_type || "N/A",
            csvSelector: (row) => row.booking_type || "N/A",
            minWidth: "150px",
            sortable: true,
        },
        {
            name: "Payment Mode",
            selector: (row) =>
                row.paid_amount > 0 ? (row.mode === "Offline" ? "Cash" : "Online") : "Credit",
            csvSelector: (row) =>
                row.paid_amount > 0 ? (row.mode === "Offline" ? "Cash" : "Online") : "Credit",
            minWidth: "150px",
            sortable: true,
        },
        {
            name: "Total",
            selector: (row) => `₹ ${row.total || 0}`,
            csvSelector: (row) => row.total || 0,
            sortable: true,
        },
        {
            name: "Total Paid",
            selector: (row) => `₹ ${row.paid_amount || 0}`,
            csvSelector: (row) => row.paid_amount || 0,
            minWidth: "150px",
            sortable: true,
        },
    ];

    {/* Function to handle showing details, can be customized */ }
    const [formData, setFormData] = useState({
        game: null,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        game_type: null,
        day: null,
        game_slot: null,
        booking_mode: null,
        payment_mode: null
    });

    const dispatch = useDispatch();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const { games, status } = useSelector((state) => state.games);
    const { commissionReport, loading } = useSelector((state) => state.cafeReport);
    const slots = useSelector((state) => state.slots?.slots || []);

    useEffect(() => {
        window.scrollTo(0, 0);
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user?._id) {
            dispatch(getGames(user._id));
        }
    }, [dispatch]);

    useEffect(() => {
        if (formData.game) {
            dispatch(getslots24(formData.game));
        }
    }, [formData.game, dispatch]);

    useEffect(() => {
        if (!formData.game) {
            setFormData(prev => ({
                ...prev,
                day: null,
                game_slot: null,
            }));
        }
    }, [formData.game]);

    // Trigger report fetch on formData change
    useEffect(() => {
        const timeout = setTimeout(() => {
            const { start_date, end_date } = formData;
            if (start_date && end_date) {
                dispatch(
                    getCommissionReport({ id: user._id, filterData: formData })
                );
            }
        }, 500); // debounce delay

        return () => clearTimeout(timeout);
    }, [formData, dispatch]);

    filteredItems = commissionReport?.bookings || [];

    const filteredSlotsByDay = formData.day
        ? slots.filter(slot => slot.day === formData.day)
        : [];

    const formatTo12Hour = (time24) => {
        const [hourStr, minuteStr] = time24.split(':');
        let hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';

        hour = hour % 12 || 12; // convert hour '0' to '12'
        return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    };

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    function exportToCSV(data, columns, filename = "report.csv", commissionReport) {
        // Prepare header
        const header = columns.map(col => col.name).join(",");
        const rows = data.map((row, idx) =>
            columns
                .map((col) => {
                    if (col.name === "SN") {
                        return `"${idx + 1}"`;
                    }
                    const value = col.csvSelector
                        ? col.csvSelector(row, idx)
                        : col.selector?.(row, idx);
                    if (typeof value === "string") {
                        return `"${value.replace(/,/g, " ").replace(/\r?\n|\r/g, " ")}"`;
                    }
                    return `"${value ?? ""}"`;
                })
                .join(",")
        );

        // Add summary row for collection data
        const summaryRow = [
            "", // SN
            "Total Earning",
            commissionReport?.total_amount ?? ""
        ].join(",");

        const paidAmountRow = [
            "", // SN
            "Total Paid Amount",
            commissionReport?.paid_amount ?? ""
        ].join(",");

        const creditAmountRow = [
            "", // SN
            "Credit Amount",
            commissionReport?.credit_amount ?? ""
        ].join(",");

        const totalBookingsRow = [
            "", // SN
            "Total Bookings",
            commissionReport?.total_bookings ?? ""
        ].join(",");

        const csvContent = [header, ...rows, summaryRow, paidAmountRow, creditAmountRow, totalBookingsRow].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="container-fluid">
            <div className="container mt-2">
                <div className="row mb-3">
                    <div className="col-12 d-flex" style={{ fontSize: '16px' }}>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Reports</a></li>
                            </ol>
                        </nav>
                    </div>

                    <div className="card shadow-sm w-100 p-3">
                        <div className="row g-3">
                            <div className="col-6 col-md-6 d-flex align-items-center">
                                <h1 className="text-uppercase fw-bold mx-2 mt-2" style={{
                                    letterSpacing: '5px',
                                    fontSize: '18px',
                                    background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Commission Report
                                </h1>
                            </div>

                            <div className="col-6 col-md-6 d-flex justify-content-md-end align-items-center">
                                <button
                                    className="btn px-4 mx-2 w-100 w-sm-auto"
                                    style={{ borderColor: '#FF3636', color: '#FF3636' }}
                                    onClick={() => exportToCSV(filteredItems, columns, "sales_report.csv", commissionReport)}
                                >
                                    <img src={solar_export} alt="export" style={{ width: '22px', height: '22px' }} className="me-2" />
                                    Export
                                </button>
                            </div>

                            <form className="row g-3">
                                <div className="col-6 col-sm-6 col-md-3">
                                    <label className="form-label fw-semibold">Start Date</label>
                                    <input type="date" name="start_date" value={formData.start_date} className="form-control rounded-2" onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                                </div>

                                <div className="col-6 col-sm-6 col-md-3">
                                    <label className="form-label fw-semibold">End Date</label>
                                    <input type="date" name="end_date" className="form-control rounded-2" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                                </div>

                                <div className="col-6 col-sm-6 col-md-3">
                                    <label className="form-label fw-semibold">Sort By Game</label>
                                    <Select
                                        classNamePrefix="select"
                                        placeholder="Select Game"
                                        isClearable
                                        isSearchable
                                        name="game"
                                        options={
                                            games?.length > 0
                                                ? games.map(game => ({
                                                    label: game.name,   // or game.title, whichever field shows the name
                                                    value: game._id
                                                }))
                                                : []
                                        }
                                        value={
                                            formData.game
                                                ? {
                                                    value: formData.game,
                                                    label: games.find(g => g._id === formData.game)?.name || 'Selected Game'
                                                }
                                                : null
                                        }
                                        onChange={(selectedOption) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                game: selectedOption ? selectedOption.value : null
                                            }))
                                        }
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderWidth: '1px',
                                                '&:hover': { borderColor: 'black' }
                                            }),
                                            placeholder: (baseStyles) => ({ ...baseStyles, color: '#6c757d' }),
                                            input: (baseStyles) => ({ ...baseStyles, color: 'black' }),
                                            singleValue: (baseStyles) => ({ ...baseStyles, color: 'black' }),
                                            option: (baseStyles, { isFocused, isSelected }) => ({
                                                ...baseStyles,
                                                backgroundColor: isSelected ? '#0d6efd' : isFocused ? '#e9ecef' : null,
                                                color: isSelected ? 'white' : 'black',
                                                ':active': {
                                                    backgroundColor: '#0d6efd',
                                                    color: 'white'
                                                }
                                            }),
                                            menu: (baseStyles) => ({
                                                ...baseStyles,
                                                position: 'absolute',
                                                width: '100%',
                                                maxWidth: '400px',
                                                zIndex: 9999
                                            }),
                                            menuList: (baseStyles) => ({
                                                ...baseStyles,
                                                maxHeight: '200px',
                                                overflowY: 'auto'
                                            })
                                        }}
                                        menuPlacement="auto"
                                        menuPosition="absolute"
                                        menuPortalTarget={document.body}
                                    />
                                </div>
                            </form>

                            <hr />

                            <div className="col-12 d-none d-md-flex justify-content-between mt-3">
                                <div className='rounded-pill px-3 py-2' style={{ backgroundColor: "#dbf9e0", color: "white" }}><h3 className='mb-0'>Total Commission: &#8377; {commissionReport?.total_commission}</h3></div>
                                {/* <div className='rounded-pill px-3 py-2' style={{ backgroundColor: "#def1fa", color: "white" }}><h3 className='mb-0'>Total Paid Amount: &#8377; {commissionReport?.paid_amount}</h3></div> */}
                                {/* <div className='rounded-pill px-3 py-2' style={{ backgroundColor: "#fbe0e4", color: "white" }}><h3 className='mb-0'>Credit Amount: &#8377; {commissionReport?.credit_amount}</h3></div> */}
                                <div className='rounded-pill px-3 py-2' style={{ backgroundColor: "#f6defa", color: "white" }}><h3 className='mb-0'>Total Bookings: {commissionReport?.total_bookings}</h3></div>
                            </div>

                            <div className="col-12 d-flex d-md-none justify-content-between mt-3">
                                <div>
                                    <div><h5>Total Commisson: &#8377; {commissionReport?.total_amount}</h5></div>
                                    {/* <div><h5>Total Paid Amount: &#8377; {commissionReport?.total_paid}</h5></div> */}
                                </div>
                                <div>
                                    {/* <div><h5>Credit Amount: &#8377; {commissionReport?.credit}</h5></div> */}
                                    <div><h5>Total Bookings: &#8377; {commissionReport?.total_bookings}</h5></div>
                                </div>
                            </div>

                            <div className="col-12" >
                                <div className="" style={{ maxWidth: "1150px" }} >
                                    <DataTable
                                        columns={columns}
                                        pagination
                                        data={filteredItems}
                                        highlightOnHover
                                        responsive
                                        persistTableHead
                                        customStyles={{
                                            rows: {
                                                style: {
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '5px',
                                                    marginBottom: '10px',
                                                    marginTop: '10px'
                                                }
                                            },
                                            headCells: {
                                                style: {
                                                    backgroundColor: '#e9f5f8',
                                                    fontWeight: 'bold',
                                                    fontSize: '13px'
                                                }
                                            },
                                            table: {
                                                style: {
                                                    borderRadius: '5px',
                                                    overflow: 'hidden',
                                                    // maxWidth:"1150px"
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
