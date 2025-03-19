export const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  };

  export const convertTo12Hour = (time) => {
    if (!time) {
      throw new Error("Time input is required.");
    }
  
    const [hour, minute] = time.split(":");
    if (!hour || !minute) {
      throw new Error("Invalid time format. Expected format: 'HH:MM'.");
    }
  
    const hours = parseInt(hour, 10);
    const minutes = parseInt(minute, 10);
  
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error("Invalid time format. Hours and minutes must be numbers.");
    }
  
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error("Invalid time. Hours must be between 0 and 23, and minutes between 0 and 59.");
    }
  
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinute = minutes < 10 ? `0${minutes}` : minutes; // Pad minutes with leading zero if necessary
  
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };