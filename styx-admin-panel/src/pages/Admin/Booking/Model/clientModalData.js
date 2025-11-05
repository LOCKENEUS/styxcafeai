export const formStructure = {
    rows: [
      {
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true, col: 6 },
          { name: "contactNumber", label: "Contact Number", type: "tel", required: true, col: 6 },
          {
            name: "creditEligibility",
            label: "Eligible for Credit",
            type: "select",
            options: [
              { label: "Select Option", value: "" },
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ],
            required: true,
            col: 6,
          },
          { name: "creditLimit", label: "Credit Limit", type: "number", required: false, col: 6 },
        ],
      }
    ],
  };