import * as hrService from "../services/hrService.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const record = await hrService.getMyHrRecord(req.user.id);
    res.json(record);
  } catch (err) {
    next(err);
  }
};

export const submitLeave = async (req, res, next) => {
  try {
    const leave = await hrService.submitLeaveRequest(req.user.id, req.body);
    res.status(201).json(leave);
  } catch (err) {
    next(err);
  }
};
