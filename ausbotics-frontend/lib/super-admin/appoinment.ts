export const updateAppointmentStatus = async (
  appointmentId: string,
  newStatus: string
) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(
      `http://localhost:5000/api/appointments/${appointmentId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to update appointment status");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
