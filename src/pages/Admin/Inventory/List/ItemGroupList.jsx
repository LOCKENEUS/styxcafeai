import React, { useState } from 'react';
import { Container, Row, Col, Table, Button, InputGroup, FormControl, Image, Breadcrumb, Card } from 'react-bootstrap';
import solar_export from '/assets/inventory/solar_export-linear.png'
import { Link, useNavigate } from 'react-router-dom';
import gm1 from '/assets/inventory/mynaui_search.svg'

const ItemGroupList = () => {
    const getRandomColor = (name) => {
        const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
        let index = name.charCodeAt(0) % colors.length;
        return colors[index];
      };
  const [searchText, setSearchText] = useState("");
  const itemsData = [
    { sn: 1, name: "Item A", unit: "kg", manufacturer: "Manufacturer A", brand: "Brand A", items: 10 },
    { sn: 2, name: "Item B", unit: "liters", manufacturer: "Manufacturer B", brand: "Brand B", items: 20 },
    { sn: 3, name: "Item C", unit: "pcs", manufacturer: "Manufacturer C", brand: "Brand C", items: 30 }
  ];
  const navigate = useNavigate();
  const generateCSV = () => {
    const headers = ["SN", "NAME", "UNIT", "MANUFACTURER", "BRAND", "ITEMS"];
    const rows = itemsData.map(item => [
      item.sn, item.name, item.unit, item.manufacturer, item.brand, item.items
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
            <Table striped style={{ minWidth: '600px', marginTop: "2rem" }}>
              <thead style={{ backgroundColor: '#0062FF0D' }}>
                <tr>
                  {['SN', 'NAME', 'UNIT', 'MANUFACTURER', 'BRAND', 'ITEMS'].map((header, index) => (
                    <th key={index} style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#F5F5F5" }}>
                {itemsData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.sn}</td>
                    <td>

                        <div className='d-flex gap-2 align-items-center cursor-pointer' onClick={() => navigate(`/admin/inventory/item-groups-details`)}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: getRandomColor(item.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: "bold", cursor: "pointer", color: "#0062FF" }}>{item.name}</span>
                        </div>
                        
                    </td>
                    <td>{item.unit}</td>
                    <td>{item.manufacturer}</td>
                    <td>{item.brand}</td>
                    <td>{item.items}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
   
      </Container>
    </div>
  );
}

export default ItemGroupList;
