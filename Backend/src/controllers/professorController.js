import * as professorService from "../services/professorService.js";

export const getProfessors = async (req, res, next) => {
  try {
    const professors = await professorService.getProfessors(req.query.search || "");
    res.json(professors);
  } catch (err) {
    next(err);
  }
};
