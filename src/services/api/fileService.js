import fileData from "@/services/mockData/files.json";

let files = [...fileData];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fileService = {
  async getAll() {
    await delay(300);
    return [...files];
  },

  async getById(id) {
    await delay(200);
    const file = files.find(item => item.Id === id);
    if (!file) {
      throw new Error("File not found");
    }
    return { ...file };
  },

  async create(fileData) {
    await delay(400);
    const newFile = {
      ...fileData,
      Id: Math.max(...files.map(item => item.Id)) + 1,
      uploadDate: new Date().toISOString(),
    };
    files.push(newFile);
    return { ...newFile };
  },

  async update(id, fileData) {
    await delay(300);
    const index = files.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("File not found");
    }
    files[index] = { ...files[index], ...fileData };
    return { ...files[index] };
  },

  async delete(id) {
    await delay(200);
    const index = files.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("File not found");
    }
    files.splice(index, 1);
    return { success: true };
  },
};