import HR from "../models/Hr.js";

export const getMyHrRecord = async (userId) => {
  const record = await HR.findOne({ userId }).populate("userId", "fullName email role");
  if (!record) {
    const err = new Error("HR record not found");
    err.statusCode = 404;
    throw err;
  }
  return record;
};

export const submitLeaveRequest = async (userId, { type, startDate, endDate, reason }) => {
  if (!type || !startDate || !endDate) {
    const err = new Error("type, startDate, and endDate are required");
    err.statusCode = 400;
    throw err;
  }

  const record = await HR.findOne({ userId });
  if (!record) {
    const err = new Error("HR record not found");
    err.statusCode = 404;
    throw err;
  }

  record.leaveRequests.push({ type, startDate, endDate, reason: reason || "" });
  await record.save();
  return record.leaveRequests[record.leaveRequests.length - 1];
};
