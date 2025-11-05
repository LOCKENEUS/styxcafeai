const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTimestamps = (response) => {
  if (!response || !response.data) return response;

  return {
    ...response,
    data: response.data.map((data) => ({
      ...data,
      createdAt: formatDate(data.createdAt),
      updatedAt: formatDate(data.updatedAt),
    })),
  };
};

module.exports = { formatDate, formatTimestamps };
