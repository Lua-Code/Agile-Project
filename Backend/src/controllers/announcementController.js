import * as announcementService from "../services/announcementService.js";

export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await announcementService.getAllAnnouncements();
    res.json(announcements);
  } catch (err) {
    next(err);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await announcementService.createAnnouncement(req.body);
    res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    await announcementService.deleteAnnouncement(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    next(err);
  }
};
