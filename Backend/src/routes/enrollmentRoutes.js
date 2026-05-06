
import { requestEnrollment, getEnrollmentRequests, getMyEnrollmentRequests, updateEnrollmentStatus,createEnrollments,getEnrollments } from "../controllers/enrollmentController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(requireAuth);

router.route("/")
  .post(createEnrollments)
  .get(getEnrollments);
router.route("/:id/status")
  .patch(updateEnrollmentStatus);
router.post("/request/:courseId", requestEnrollment);
router.get("/requests", requireRole("admin"), getEnrollmentRequests);
router.get("/requests/my-requests", getMyEnrollmentRequests);
router.put("/:id/status", requireRole("admin"), updateEnrollmentStatus);

export default router;
