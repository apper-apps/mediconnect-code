import scheduleData from "@/services/mockData/schedule.json";

let schedule = [...scheduleData];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const scheduleService = {
  async getAll() {
    await delay(300);
    return [...schedule];
  },

  async getById(id) {
    await delay(200);
    const scheduleItem = schedule.find(item => item.Id === id);
    if (!scheduleItem) {
      throw new Error("Schedule item not found");
    }
    return { ...scheduleItem };
  },

  async create(scheduleData) {
    await delay(400);
    const newScheduleItem = {
      ...scheduleData,
      Id: Math.max(...schedule.map(item => item.Id)) + 1,
    };
    schedule.push(newScheduleItem);
    return { ...newScheduleItem };
  },

  async update(id, scheduleData) {
    await delay(300);
    const index = schedule.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Schedule item not found");
    }
    schedule[index] = { ...schedule[index], ...scheduleData };
    return { ...schedule[index] };
  },

  async delete(id) {
    await delay(200);
    const index = schedule.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Schedule item not found");
    }
    schedule.splice(index, 1);
    return { success: true };
  },

  async updateSchedule(scheduleArray) {
    await delay(500);
    schedule = scheduleArray.map((item, index) => ({
      ...item,
      Id: index + 1,
    }));
    return [...schedule];
  },
};