import React from "react";

const LocationDetails = () => {
  return (
    <div>
      {/* Displaying the saved locations */}
      {/* {locations.length > 0 && (
        <Card className="shadow-sm">
          <Card.Body>
            <h4>Saved Locations</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{location.address}</td>
                    <td>{location.city}</td>
                    <td>{location.country}</td>
                    <td>{location.state}</td>
                    <td>{location.lat}</td>
                    <td>{location.lng}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )} */}
    </div>
  );
};

export default LocationDetails;
