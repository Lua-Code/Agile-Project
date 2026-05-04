import Resource from "../models/Resource.js";

export const getResourcesService = async () => {
  return await Resource.find().sort({ createdAt: -1 });
};

export const createResourceService = async (data) => {
  const {
    name,
    category,
    department,
    quantity,
    availableQuantity,
    condition,
    status,
    notes,
  } = data;

  if (!name || !department || !quantity) {
    const error = new Error("Name, department, and quantity are required");
    error.statusCode = 400;
    throw error;
  }

  if (availableQuantity > quantity) {
    const error = new Error("Available quantity cannot exceed total quantity");
    error.statusCode = 400;
    throw error;
  }

  return await Resource.create({
    name,
    category,
    department,
    quantity,
    availableQuantity,
    condition,
    status,
    notes,
  });
};