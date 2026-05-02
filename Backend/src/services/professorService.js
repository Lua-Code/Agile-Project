import Professor from "../models/Professor.js";

export const getProfessors = async (search) => {
  let professors = await Professor.find()
    .populate("userId", "fullName email")
    .lean();

  if (search) {
    const regex = new RegExp(search, "i");
    professors = professors.filter((p) => regex.test(p.userId?.fullName));
  }

  return professors.map((p) => ({
    _id: p._id,
    name: p.userId?.fullName,
    email: p.userId?.email,
  }));
};
