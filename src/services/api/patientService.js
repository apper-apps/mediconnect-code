import patientData from "@/services/mockData/patients.json";

let patients = [...patientData];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const patientService = {
  async getAll() {
    await delay(300);
    return [...patients];
  },

  async getById(id) {
    await delay(200);
    const patient = patients.find(item => item.Id === id);
    if (!patient) {
      throw new Error("Patient not found");
    }
    return { ...patient };
  },

  async create(patientData) {
    await delay(400);
    const newPatient = {
      ...patientData,
      Id: Math.max(...patients.map(item => item.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    patients.push(newPatient);
    return { ...newPatient };
  },

  async update(id, patientData) {
    await delay(300);
    const index = patients.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patients[index] = { ...patients[index], ...patientData };
    return { ...patients[index] };
  },

  async delete(id) {
    await delay(200);
    const index = patients.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patients.splice(index, 1);
    return { success: true };
  },
};