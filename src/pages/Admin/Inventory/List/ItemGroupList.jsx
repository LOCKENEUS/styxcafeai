import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, InputGroup, FormControl, Image, Breadcrumb, Card } from 'react-bootstrap';
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
    <div>
      <Container data-aos="fade-right" data-aos-duration="500" fluid className="mt-4 min-vh-100">
    <Breadcrumb>
        <Breadcrumb.Item href="/admin">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="/admin/inventory">Inventory</Breadcrumb.Item>
      <Breadcrumb.Item href="/admin/inventory/item-group-list">Item Group List</Breadcrumb.Item>
    </Breadcrumb>

        <Row>
          <Col sm={4} className="d-flex">
            <h1 className="mx-1 my-4" style={{ fontSize: "18px", fontWeight: "500" }}>Item Group List</h1>
          </Col>

          <Col sm={4} className="d-flex">
        
                            <InputGroup className="mx-1 my-3">
                                <InputGroup.Text className="border-0" style={{ background: "#FAFAFA" }}>
                                    <img src={gm1} alt="Search Icon" />
                                </InputGroup.Text>
                                <FormControl
                                    type="search"
                                    size="sm"
                                    placeholder="Search for vendors"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ backgroundColor: "#FAFAFA", border: "none" }}
                                />
                            </InputGroup>
                     
          </Col>

          <Col sm={4} className="d-flex align-items-center justify-content-end" style={{ height: '50px' }}>
            <Button variant="light" className="me-2 border-1 text-danger border-danger" onClick={generateCSV} style={{ height: '100%' }}>
              <Image className="me-2" style={{ width: "22px", height: "22px" }} src={solar_export} />
              Export
            </Button>
            <Button variant="primary" className="mx-2" size="sm" style={{ height: '100%' }}>
                <Link to="/admin/inventory/item-group-form" className="text-white"> 
              + Create Item Group
              </Link>
            </Button>
          </Col>

          <Col sm={12}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <Table striped style={{ minWidth: '600px', marginTop: "2rem" }}>
                <thead style={{ backgroundColor: '#0062FF0D' }}>
                  <tr>
                    {['SN', 'NAME', 'UNIT', 'MANUFACTURER', 'BRAND', 'ITEMS'].map((header, index) => (
                      <th key={index} style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "#F5F5F5" }}>
                  {itemGroups.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className='d-flex gap-2 align-items-center cursor-pointer' onClick={() => navigate(`/admin/inventory/item-groups-details/${item._id}`)}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: getRandomColor(item.group_name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.group_name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: "bold", cursor: "pointer", color: "#0062FF" }}>{item.group_name}</span>
                        </div>
                      </td>
                      <td>{item.unit?.name || 'N/A'}</td>
                      <td>{item.manufacturer?.name || 'N/A'}</td>
                      <td>{item.brand?.name || 'N/A'}</td>
                      <td>{item.items.length}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
   
      </Container>
    </div>
  );
}

export default ItemGroupList;
