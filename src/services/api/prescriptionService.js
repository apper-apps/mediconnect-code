import prescriptionData from "@/services/mockData/prescriptions.json";

let prescriptions = [...prescriptionData];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const prescriptionService = {
  async getAll() {
    await delay(300);
    return [...prescriptions];
  },

  async getById(id) {
    await delay(200);
    const prescription = prescriptions.find(item => item.Id === id);
    if (!prescription) {
      throw new Error("Prescription not found");
    }
    return { ...prescription };
  },

  async create(prescriptionData) {
    await delay(400);
    const newPrescription = {
      ...prescriptionData,
      Id: Math.max(...prescriptions.map(item => item.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    prescriptions.push(newPrescription);
    return { ...newPrescription };
  },

  async update(id, prescriptionData) {
    await delay(300);
    const index = prescriptions.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Prescription not found");
    }
    prescriptions[index] = { ...prescriptions[index], ...prescriptionData };
    return { ...prescriptions[index] };
  },

  async delete(id) {
    await delay(200);
    const index = prescriptions.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Prescription not found");
    }
    prescriptions.splice(index, 1);
    return { success: true };
  },
};