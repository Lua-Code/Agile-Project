import Announcement from "../models/Announcement.js";

export const getAllAnnouncements = async () => {
  return await Announcement.find().sort({ postDate: -1 });
};

export const createAnnouncement = async ({ title, description, postDate }) => {
  if (!title || !description) {
    const err = new Error("Title and description are required");
    err.statusCode = 400;
    throw err;
  }
  return await Announcement.create({ title, description, postDate: postDate || Date.now() });
};

export const deleteAnnouncement = async (id) => {
  const announcement = await Announcement.findByIdAndDelete(id);
  if (!announcement) {
    const err = new Error("Announcement not found");
    err.statusCode = 404;
    throw err;
  }
};
