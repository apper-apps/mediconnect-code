import appointmentData from "@/services/mockData/appointments.json";

let appointments = [...appointmentData];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentService = {
  async getAll() {
    await delay(300);
    return [...appointments];
  },

  async getById(id) {
    await delay(200);
    const appointment = appointments.find(item => item.Id === id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  },

  async create(appointmentData) {
    await delay(400);
    const newAppointment = {
      ...appointmentData,
      Id: Math.max(...appointments.map(item => item.Id)) + 1,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    appointments.push(newAppointment);
    return { ...newAppointment };
  },

  async update(id, appointmentData) {
    await delay(300);
    const index = appointments.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    appointments[index] = { ...appointments[index], ...appointmentData };
    return { ...appointments[index] };
  },

  async delete(id) {
    await delay(200);
    const index = appointments.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    appointments.splice(index, 1);
    return { success: true };
  },
};