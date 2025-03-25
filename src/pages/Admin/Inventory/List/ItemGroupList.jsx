import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, InputGroup, FormControl, Image, Breadcrumb, Card, Pagination, BreadcrumbItem } from 'react-bootstrap';
import solar_export from '/assets/inventory/solar_export-linear.png'
import { Link, useNavigate } from 'react-router-dom';
import gm1 from '/assets/inventory/mynaui_search.svg'
import { useDispatch, useSelector } from 'react-redux';
import { getItemGroups } from '../../../../store/AdminSlice/Inventory/ItemGroupSlice'; // Adjust the path as necessary

const ItemGroupList = () => {
    const getRandomColor = (name) => {
        const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
        let index = name.charCodeAt(0) % colors.length;
        return colors[index];
      };
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const cafeId = user?._id;
  const { itemGroups, loading, error } = useSelector((state) => state.itemGroups);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const filteredGroups = itemGroups.filter((group) =>
    group.group_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const generateCSV = () => {
    const headers = ["SN", "NAME", "UNIT", "MANUFACTURER", "BRAND", "ITEMS"];
    const rows = itemGroups.map(item => [
      item.sn, item.group_name, item.unit, item.manufacturer, item.brand, item.items.length
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'item_group_list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    dispatch(getItemGroups(cafeId)).then((res) => {
      console.log("res.payload", res.payload);
    });
  }, [dispatch, cafeId]);

  return (
    <Container>
      <Row>
        <Col sm={12} className="mx-4 my-3">
          <div style={{ top: "186px" }}>
            <Breadcrumb>
              <BreadcrumbItem ><Link to="/admin/dashboard">Home</Link></BreadcrumbItem>
              <BreadcrumbItem ><Link to="/admin/inventory/dashboard">Inventory</Link></BreadcrumbItem>
              <BreadcrumbItem active>Item Group List</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        <Col sm={12}>
          <Card data-aos="fade-right" data-aos-duration="1000" className="mx-4 p-3">
            <Row className="align-items-center">
              <Col sm={4} className="d-flex my-2">
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    lineHeight: "18px",
                  }}
                  className="m-0"
                >
                  Item Group List
                </h1>
              </Col>

              <Col sm={3} className="d-flex my-2">
                <InputGroup className="navbar-input-group">
                  <InputGroup.Text
                    className="border-0"
                    style={{ backgroundColor: "#FAFAFA" }}
                  >
                    <img src={gm1} alt="Search Icon" />
                  </InputGroup.Text>

                  <FormControl
                    type="search"
                    size="sm"
                    placeholder="Search for item groups"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ backgroundColor: "#FAFAFA", border: "none" }}
                  />

                  {searchText && (
                    <InputGroup.Text
                      as="button"
                      className="border-0 bg-transparent"
                      onClick={() => setSearchText("")}
                    >
                      ✖
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </Col>

              <Col sm={5} className="d-flex justify-content-end text-end my-2">
                <Button variant="white" className="btn px-4 mx-2" size="sm" onClick={generateCSV} style={{ borderColor: "#FF3636", color: "#FF3636" }}>
                  <Image className="me-2" style={{ width: "22px", height: "22px" }} src={solar_export} />
                  Export
                </Button>

                <Link to="/admin/inventory/item-group-form">
                  <Button variant="primary" className="px-4 mx-2" size="sm">
                    + Create Item Group
                  </Button>
                </Link>
              </Col>

              <Col sm={12} style={{ marginTop: "30px" }}>
                <Table striped style={{ minWidth: '600px', marginTop: "2rem" }}>
                  <thead  style={{ backgroundColor: '#0062FF0D' }}>
                    <tr className="no-uppercase">
                      {['S/N', 'Name', 'Unit', 'Manufacturer', 'Brand', 'Items'].map((header, index) => (
                        <th key={index} style={{ fontWeight: "bold", fontSize: "0.9rem", color:'black' }}> <h4> {header} </h4></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#F5F5F5" }}>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          Loading...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-danger">
                          {error}
                        </td>
                      </tr>
                    ) : (
                      filteredGroups
                        .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                            <td>
                              <div className='d-flex gap-2 align-items-center cursor-pointer' onClick={() => navigate(`/admin/inventory/item-groups-details/${item._id}`)}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: getRandomColor(item.group_name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {item.group_name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: "bold", cursor: "pointer", color: "#0062FF" }}>{item.group_name}</span>
                              </div>
                            </td>
                            <td>{item.unit || 'N/A'}</td>
                            <td>{item.manufacturer?.name || 'N/A'}</td>
                            <td>{item.brand?.name || 'N/A'}</td>
                            <td>{item.items.length}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.Prev 
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === activePage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
          />
        </Pagination>
      </div>
      <style jsx>{`
  .no-uppercase th {
    text-transform: none !important;
  }
  
  @media (max-width: 768px) {
    .table-responsive {
      overflow-x: auto;
    }
    
    th h4 {
      font-size: 0.8rem;
    }
    
    td {
      font-size: 0.8rem;
    }
  }
`}</style>

    </Container>
  );
}

export default ItemGroupList;
