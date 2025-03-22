import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Col,
  Container,
  FormControl,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import gm1 from "/assets/inventory/mynaui_search.svg";
import solar_export from "/assets/inventory/solar_export-linear.png";
import add from "/assets/inventory/material-symbols_add-rounded.png";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { CreateVendor, GetPOList } from "../../../../store/AdminSlice/Inventory/purchaseOrder";
import { useDispatch, useSelector } from "react-redux";


const PurchaseOrderList = () => {
  // State for search input
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(3 / itemsPerPage);
   


  // Function to handle modal (replace with actual logic)
  const handleShowCreate = () => {
    console.log("Show create item modal");
    navigate("/admin/inventory/purchase-order");
  };


  const getRandomColor = (name) => {
   
    const colors = ["#FAED39", "#FF5733", "#33FF57", "#339FFF", "#FF33F6", "#FFAA33", "#39DDFA", "#3DFF16"];
    let index = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length;

    // const  POList= useSelector((state) => state.selectedItem);

    const selectedItem = useSelector((state) => state.purchaseOrder);
    // listPOAll =selectedItem?.selectedItem;
    // const listOfPO = selectedItem?.selectedItem;
    // console.log("POList",listOfPO);
    
    const listOfPO = Array.isArray(selectedItem?.selectedItem)
  ? selectedItem.selectedItem
  : []; 
  console.log("listOfPO",listOfPO);

  const formattedPOList = listOfPO.map((po, index) => ({
    sn: index + 1,
    name: po.po_no,
    vendor: po.vendor_id?.name || "-",
    amount: po.total?.toFixed(2) || "0.00",
    status: po.pending_qty > 0 ? "Pending" : "Completed",
    deliveryDate: new Date(po.delivery_date).toLocaleDateString(),
    listOfPO: po
  }));
console.log("formattedPOList",formattedPOList);

    



    return colors[index];
  };
  const user = JSON.parse(sessionStorage.getItem('user'));
      const cafeId = user?._id;

  const dispatch = useDispatch();
  useEffect(() => { 
      
        dispatch(GetPOList(cafeId));
    
    }, [dispatch]);

   


    const columns = [
      {
        name: "SN",
        selector: (row) => row.sn,
        minWidth: "70px",
        maxWidth: "70px",
      },
      {
        name: "Order No",
        selector: (row) => row.name,
        sortable: true,
        cell: (row) => (
          <div className="d-flex align-items-center">
            <span
              className="d-flex justify-content-center align-items-center rounded-circle me-2"
              style={{
                width: "35px",
                height: "35px",
                backgroundColor: getRandomColor(row.name),
                color: "white",
                fontWeight: "bold",
                padding: "8px 12px",
                gap: "10px",
              }}
            >
              {row.name.charAt(0)}
            </span>
            <div>
              <div
                style={{ color: "#0062FF", cursor: "pointer" }}
                onClick={() => handleShowDetails(row.listOfPO)} // Pass the full PO if needed
              >
                {row.name}
              </div>
            </div>
          </div>
        ),
      },
      { name: "Vendor", selector: (row) => row.vendor, sortable: true },
      { name: "Amount", selector: (row) => row.amount, sortable: true },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => (
          <div
            style={{
              backgroundColor:
                row.status === "Pending"
                  ? "#fdffcc"
                  : row.status === "Completed"
                  ? "#D1FFC8"
                  : "#FFD9DA",
              textAlign: "center",
              borderRadius: "8px",
              padding: "5px",
              width: "50%",
              display: "inline-block",
            }}
          >
            {row.status}
          </div>
        ),
      },
      {
        name: "Delivery Date",
        selector: (row) => row.deliveryDate,
        sortable: true,
      },
    ];
    


  const itemsData = [
    { sn: 1, name: "PO-12", amount: "31", status: "Pending", deliveryDate: "21/10/2022",vendor:"Silas Buckley" },
    { sn: 2, name: "PO-13", amount: "6", status: "Shipped", deliveryDate: "21/2/2022" ,vendor:"Silas Buckley"},
    { sn: 3, name: "PO-14", amount: "21", status: "Completed", deliveryDate: "21/2/2022",vendor:"Silas Buckley" },
    { sn: 4, name: "PO-19", amount: "1", status: "Shipped", deliveryDate: "21/12/2022",vendor:"Silas Buckley" },
    { sn: 5, name: "PO-182", amount: "2", status: "Packed", deliveryDate: "21/12/2022",vendor:"Silas Buckley" },

  ];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

    const handleShowDetails = () => {
      navigate("/admin/inventory/purchase-order-details");
    }
  const filteredItems = itemsData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deliveryDate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container >
      <Row>
        <Col sm={12} className="mx-4 my-3">
          <div style={{ top: "186px", fontSize: "18px" }}>
            <Breadcrumb>
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">Purchase </BreadcrumbItem>
              <BreadcrumbItem active>Purchase Order List</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Col>

        {/* Items List Card */}
        <Col sm={12}>

          <Card className="mx-4 p-3">
            <Row className="align-items-center">
              {/* Title */}
              <Col sm={4} className="d-flex my-2">
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    lineHeight: "18px",
                  }}
                  className="m-0"
                >
                  Purchase Order List
                </h1>
              </Col>

              {/* Search Input */}
              <Col sm={3} className="d-flex my-2">
                <InputGroup className="navbar-input-group">
                  <InputGroupText
                    className="border-0"
                    style={{ backgroundColor: "#FAFAFA" }}
                  >
                    <Image src={gm1} />
                  </InputGroupText>

                  <FormControl
                    type="search"
                    size="sm"
                    placeholder="Search for Purchase Order "
                    aria-label="Search in docs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}  // Update searchQuery directly
                    style={{ backgroundColor: "#FAFAFA", border: "none" }}
                  />


                  {searchQuery && (
                    <InputGroupText
                      as="button"
                      className="border-0 bg-transparent"
                      onClick={() => setSearchQuery("")}  // Clear searchQuery instead of searchText
                    >
                      ✖
                    </InputGroupText>
                  )}

                </InputGroup>
              </Col>

              {/* Action Buttons */}
              <Col sm={5} className="d-flex justify-content-end text-end my-2">
                <Button variant="denger" className="btn  px-4 mx-2" size="sm" style={{ borderColor: "#FF3636", color: "#FF3636" }}>
                  <Image className="me-2 size-sm" style={{ width: "22px", height: "22px" }} src={solar_export} />
                  Export
                </Button>

                <Button variant="primary" className="px-4 mx-2" size="sm" 
                onClick={handleShowCreate}
                >
                  <Image
                    className="me-2"
                    style={{ width: "22px", height: "22px" }}
                    src={add}
                  />
                  New PO
                </Button>
              </Col>


              <Col sm={12} style={{ marginTop: "30px" }}>
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  // pagination
                  highlightOnHover
                  responsive
                  persistTableHead
                  customStyles={{
                    rows: {
                      style: {
                        backgroundColor: "#ffffff", padding: 'clamp(10px, 2vw, 15px)',
                        border: 'none',
                        fontSize: '14px',
                      }
                    },
                    headCells: {
                      style: {
                        backgroundColor: "#e9f5f8", padding: 'clamp(10px, 2vw, 15px)',
                        border: 'none',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                      },
                    },
                    table: { style: { borderRadius: "5px", overflow: "hidden" } },
                  }}
                />
              </Col>
            </Row>
          </Card></Col>
      </Row>
    </Container>
  );
};

export default PurchaseOrderList;
