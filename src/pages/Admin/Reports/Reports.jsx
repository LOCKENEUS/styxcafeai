import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import solar_export from '/assets/inventory/solar_export-linear.png';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { getGames } from '../../../store/slices/gameSlice';
import { getslots24 } from '../../../store/slices/slotsSlice';
import { getCafeReportData } from '../../../store/AdminSlice/reports';
import { Button, Card, Col, Container, Form, Pagination, Row, Table } from 'react-bootstrap';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs/Breadcrumbs';

export const Reports = () => {
  let filteredItems = [];
  // const columns = [
  //   {
  //     name: "SN",
  //     selector: (row, index) => index + 1,
  //     minWidth: "70px",
  //     maxWidth: "70px",
  //   },
  //   {
  //     name: "Game",
  //     selector: (row) => row.game_name,
  //     sortable: true,
  //     cell: (row) => (
  //       <div>
  //         <div
  //           style={{ color: "#0062FF", cursor: "pointer" }}
  //           onClick={() => handleShowDetails(row.game_name)}
  //         >
  //           {row.game_name}
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "Bookings",
  //     selector: (row) => row.total_bookings,
  //     sortable: true,
  //     cell: (row) => (
  //       <div>
  //         {row.total_bookings}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "Slot",
  //     selector: (row) => `${row.slot_start_time} - ${row.slot_end_time}`,
  //     sortable: true,
  //   },
  //   {
  //     name: "Bookin Type",
  //     selector: (row) => row.booking_type,
  //     sortable: true,
  //     cell: (row) => (
  //       <span>
  //         {row.booking_type}
  //       </span>
  //     ),
  //   },
  //   {
  //     name: "Payment Mode",
  //     selector: (row) => row.payment_mode,
  //     sortable: true,
  //     cell: (row) => (
  //       <span>
  //         {row.payment_mode === "Offline" ? "Cash" : "Online"}
  //       </span>
  //     ),
  //   },
  //   {
  //     name: "Total",
  //     selector: (row) => row.total,
  //     sortable: true,
  //     cell: (row) => (
  //       <span>
  //         ₹ {row.total ? row.total : "N/A"}
  //       </span>
  //     ),
  //   },
  //   {
  //     name: "Total Paid",
  //     selector: (row) => row.total_paid,
  //     sortable: true,
  //     cell: (row) => {
  //       // Extract only the date part from the ISO string
  //       return (
  //         <span>
  //           ₹ {row.total_paid ? row.total_paid : "N/A"}
  //         </span>
  //       );
  //     },
  //   },
  // ];

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

  const user = JSON.parse(localStorage.getItem('user'));
  const { games, status } = useSelector((state) => state.games);
  const { cafeReport, loading } = useSelector((state) => state.cafeReport);
  const slots = useSelector((state) => state.slots?.slots || []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem('user'));
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
          getCafeReportData({ id: user._id, filterData: formData })
        );
      }
    }, 500); // debounce delay

    return () => clearTimeout(timeout);
  }, [formData, dispatch]);

  filteredItems = cafeReport?.records || [];

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

  function exportToCSV(data, columns, filename = "report.csv", cafeReport) {
    // Prepare header
    const header = columns.map(col => col.name).join(",");

    // Prepare rows with correct serial number
    const rows = data.map((row, idx) =>
      columns.map((col, colIdx) => {
        if (col.name === "SN") {
          return `"${idx + 1}"`; // Serial number
        }
        if (col.selector) {
          let value = col.selector(row, idx);
          if (typeof value === "string") {
            value = value.replace(/,/g, " ").replace(/\r?\n|\r/g, " ");
          }
          return `"${value ?? ""}"`;
        }
        return "";
      }).join(",")
    );

    // Add summary row for collection data

    const summaryRow = [
      "", // SN
      "Total Earning",
      bookingsReport?.total_amount ?? ""
    ].join(",");

    const paidAmountRow = [
      "", // SN
      "Total Paid Amount",
      bookingsReport?.paid_amount ?? ""
    ].join(",");

    const creditAmountRow = [
      "", // SN
      "Credit Amount",
      bookingsReport?.credit_amount ?? ""
    ].join(",");

    const totalBookingsRow = [
      "", // SN
      "Total Bookings",
      bookingsReport?.total_bookings ?? ""
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

  // Table section
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination className="justify-content-center mt-3">
        {items}
      </Pagination>
    );
  };

  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container fluid>
      <Breadcrumbs
        items={[
          { label: "Home", path: "/admin/dashboard" },
          { label: "Inventory Setting", active: true }
        ]}
      />

      {/* <Row>
        <Card>
          <div className="row g-3">
            <div className="col-6 col-md-6 d-flex align-items-center">
              <h1 className="text-uppercase fw-bold mx-2 mt-2" style={{
                letterSpacing: '5px',
                fontSize: '18px',
                background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Sales Report
              </h1>
            </div>

            <div className="col-6 col-md-6 d-flex justify-content-md-end align-items-center">
              <button
                className="btn px-4 mx-2 w-100 w-sm-auto"
                style={{ borderColor: '#FF3636', color: '#FF3636' }}
                onClick={() => exportToCSV(filteredItems, columns, "sales_report.csv", cafeReport)}
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

              <div className="col-6 col-sm-6 col-md-3">
                <label className="form-label fw-semibold">Game Type</label>
                <select name="game_type" className="form-select rounded-2" value={formData.game_type} onChange={(e) => setFormData({ ...formData, game_type: e.target.value })}>
                  <option>Select Game Type</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>

              <div className="col-6 col-sm-6 col-md-3">
                <label className="form-label fw-semibold">Day</label>
                <select name="day" className="form-select rounded-2" value={formData.day || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, day: e.target.value })
                  }>
                  <option>Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div className="col-6 col-sm-6 col-md-3">
                <label className="form-label fw-semibold">Game Slot</label>
                <select name="game_type" className="form-select rounded-2" value={formData.game_slot || ''} onChange={(e) => setFormData({ ...formData, game_slot: e.target.value })} disabled={!formData.game && !formData.day}>
                  <option>Select Game Slot</option>
                  {filteredSlotsByDay.map(slot => (
                    <option key={slot._id} value={slot._id}>
                      {formatTo12Hour(slot.start_time)} - {formatTo12Hour(slot.end_time)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-sm-6 col-md-3">
                <label className="form-label fw-semibold">Booking Mode</label>
                <select name="booking_mode" className="form-select rounded-2" value={formData.booking_mode || ''} onChange={(e) => setFormData({ ...formData, booking_mode: e.target.value })}>
                  <option value="">Select Booking Mode</option>
                  <option value={false}>Advance Booking</option>
                  <option value={true}>Pay Later</option>
                </select>
              </div>

              <div className="col-6 col-sm-6 col-md-3">
                <label className="form-label fw-semibold">Payment Mode</label>
                <select name="payment_mode" className="form-select rounded-2" value={formData.payment_mode || ''} onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}>
                  <option value="">Select Payment Mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Cash</option>
                </select>
              </div>
            </form>

            <hr />

            <div className="col-12 d-none d-md-flex justify-content-between mt-3">
              <div className='rounded-pill px-3 py-2' style={{ backgroundColor: "#dbf9e0", color: "white" }}><h3 className='mb-0'>Total Earnings: &#8377; {cafeReport?.total_amount || 0}</h3></div>
              <div className='rounded-pill px-3 py-2' style={{ backgroundColor: "#def1fa", color: "white" }}><h3 className='mb-0'>Total Paid Amount: &#8377; {cafeReport?.total_paid || 0}</h3></div>
              <div className='rounded-pill px-3 py-2' style={{ backgroundColor: "#fbe0e4", color: "white" }}><h3 className='mb-0'>Credit Amount: &#8377; {cafeReport?.credit_amount || 0}</h3></div>
              <div className='rounded-pill px-3 py-2' style={{ backgroundColor: "#f6defa", color: "white" }}><h3 className='mb-0'>Total Bookings: {cafeReport?.total_bookings || 0}</h3></div>
            </div>

            <div className="col-12 d-flex d-md-none justify-content-between mt-3">
              <div>
                <div><h5>Total Earnings: &#8377; {cafeReport?.total_amount || 0}</h5></div>
                <div><h5>Total Paid Amount: &#8377; {cafeReport?.total_paid || 0}</h5></div>
              </div>
              <div>
                <div><h5>Credit Amount: &#8377; {cafeReport?.credit || 0}</h5></div>
                <div><h5>Total Bookings: &#8377; {cafeReport?.total_bookings || 0}</h5></div>
              </div>
            </div>

            <div className="col-12 table-responsive">
              <DataTable
                columns={columns}
                data={filteredItems}
                highlightOnHover
                pagination
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
                      overflow: 'hidden'
                    }
                  }
                }}
              />
            </div>
          </div>
        </Card>
      </Row> */}
      <Card className="p-3">
        <Row>
          <Col xs={12} md={12}>
            <Row className="align-items-center mb-3">
              <Col xs={12} md={6}>
                <h1
                  className="text-uppercase fw-bold"
                  style={{
                    letterSpacing: '5px',
                    fontSize: '18px',
                    background: 'linear-gradient(to right,rgb(0, 119, 255),rgb(0, 17, 255))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Sales Report
                </h1>
              </Col>
              <Col xs={12} md={6} className="d-flex justify-content-md-end mt-2 mt-md-0">
                <Button
                  variant="outline-danger"
                  className="d-flex align-items-center"
                  onClick={() =>
                    exportToCSV(filteredItems, columns, "sales_report.csv", cafeReport)
                  }
                >
                  <img src={solar_export} alt="export" style={{ width: '22px', height: '22px' }} className="me-2" />
                  Export
                </Button>
              </Col>
            </Row>

            <Form>
              <Row className="g-3">
                <Col xs={6} md={3}>
                  <Form.Group controlId="startDate">
                    <Form.Label className="fw-semibold">Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={6} md={3}>
                  <Form.Group controlId="endDate">
                    <Form.Label className="fw-semibold">End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={6} md={3}>
                  <Form.Group controlId="game">
                    <Form.Label className="fw-semibold">Sort By Game</Form.Label>
                    <Select
                      classNamePrefix="select"
                      placeholder="Select Game"
                      isClearable
                      isSearchable
                      options={games?.map((game) => ({
                        label: game.name,
                        value: game._id
                      })) || []}
                      value={
                        formData.game
                          ? {
                            value: formData.game,
                            label: games.find((g) => g._id === formData.game)?.name || "Selected Game"
                          }
                          : null
                      }
                      onChange={(selectedOption) =>
                        setFormData((prev) => ({
                          ...prev,
                          game: selectedOption ? selectedOption.value : null
                        }))
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={6} md={3}>
                  <Form.Group controlId="gameType">
                    <Form.Label className="fw-semibold">Game Type</Form.Label>
                    <Form.Select
                      value={formData.game_type}
                      onChange={(e) =>
                        setFormData({ ...formData, game_type: e.target.value })
                      }
                    >
                      <option>Select Game Type</option>
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={6} md={3}>
                  <Form.Group controlId="day">
                    <Form.Label className="fw-semibold">Day</Form.Label>
                    <Form.Select
                      value={formData.day || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, day: e.target.value })
                      }
                    >
                      <option>Select Day</option>
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={6} md={3}>
                  <Form.Group controlId="gameSlot">
                    <Form.Label className="fw-semibold">Game Slot</Form.Label>
                    <Form.Select
                      value={formData.game_slot || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, game_slot: e.target.value })
                      }
                      disabled={!formData.game && !formData.day}
                    >
                      <option>Select Game Slot</option>
                      {filteredSlotsByDay.map((slot) => (
                        <option key={slot._id} value={slot._id}>
                          {formatTo12Hour(slot.start_time)} - {formatTo12Hour(slot.end_time)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={6} md={3}>
                  <Form.Group controlId="bookingMode">
                    <Form.Label className="fw-semibold">Booking Mode</Form.Label>
                    <Form.Select
                      value={formData.booking_mode || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, booking_mode: e.target.value })
                      }
                    >
                      <option value="">Select Booking Mode</option>
                      <option value={false}>Advance Booking</option>
                      <option value={true}>Pay Later</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={6} md={3}>
                  <Form.Group controlId="paymentMode">
                    <Form.Label className="fw-semibold">Payment Mode</Form.Label>
                    <Form.Select
                      value={formData.payment_mode || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, payment_mode: e.target.value })
                      }
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Cash</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>

            <hr className="my-4" />

            {/* Summary Section */}
            <Row className="text-center gy-2">
              <Col xs={6} md={3}>
                <Card className="bg-success text-white">
                  <Card.Body>
                    <Card.Title>Total Earnings</Card.Title>
                    <Card.Text>&#8377; {cafeReport?.total_amount || 0}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="bg-primary text-white">
                  <Card.Body>
                    <Card.Title>Total Paid Amount</Card.Title>
                    <Card.Text>&#8377; {cafeReport?.total_paid || 0}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="bg-danger text-white">
                  <Card.Body>
                    <Card.Title>Credit Amount</Card.Title>
                    <Card.Text>&#8377; {cafeReport?.credit_amount || 0}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="bg-warning text-white">
                  <Card.Body>
                    <Card.Title>Total Bookings</Card.Title>
                    <Card.Text>{cafeReport?.total_bookings || 0}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <hr className="my-4" />

            {/* Table Section */}
            {/* <div className="table-responsive">
              <Table bordered hover responsive className="align-middle">
                <thead style={{ backgroundColor: '#e9f5f8' }}>
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx}>{col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => (
                    <tr key={idx}>
                      {columns.map((col, colIdx) => (
                        <td key={colIdx}>
                          {col.selector ? col.selector(item) : item[col.selectorKey]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div> */}

            <Col xs={12}>
              <div className="mt-4">
                <div className="table-responsive">
                  <Table bordered hover responsive striped>
                    <thead className="table-light bg-red">
                      <tr>
                        <th>SN</th>
                        <th>Booking ID</th>
                        <th>Game</th>
                        <th>Slot</th>
                        <th>Players</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Paid Amount</th>
                        <th>Payment Mode</th>
                        <th>Booking Type</th>
                        <th>Credit Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((row, index) => (
                          <tr key={row._id || index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td style={{ color: "#0062FF", cursor: "pointer" }}
                              onClick={() => window.location.href = `/admin/booking/checkout/${row._id}`}>
                              {row.booking_id || "N/A"}
                            </td>
                            <td style={{ color: "#0062FF", cursor: "pointer" }}
                              onClick={() => window.location.href = `/admin/games/game-details/${row?.game_id?._id}`}>
                              {row?.game_id?.name || "N/A"}
                            </td>
                            <td>{`${row?.slot_id?.start_time || ""} - ${row?.slot_id?.end_time || ""}`}</td>
                            <td>{`${(row?.players?.length || 0) + 1} Players`}</td>
                            <td>{row.items?.length || 0}</td>
                            <td>{`₹ ${row.total || 0}`}</td>
                            <td>{`₹ ${row.paid_amount || 0}`}</td>
                            <td>
                              {row.paid_amount > 0
                                ? row.mode === "Offline" ? "Cash" : "Online"
                                : "Credit"}
                            </td>
                            <td>{row.booking_type || "N/A"}</td>
                            <td>{`₹ ${row.credit_amount || 0}`}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                {totalPages > 1 && renderPagination()}
              </div>
            </Col>
          </Col>
        </Row>
      </Card>
    </Container>
  )
}