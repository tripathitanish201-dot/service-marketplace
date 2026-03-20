const express = require('express');
const reviewController = require('../../app/controllers/reviewController');
const { authenticate, authorizeRoles } = require('../../app/middlewares/authMiddleware');
const validate = require('../../app/middlewares/validateMiddleware');
const { reviewSchema } = require('../../app/validations/reviewValidation');

const router = express.Router();

// Public: Get reviews for a provider
router.get('/provider/:providerId', reviewController.getProviderReviews);

// Protected: Users can leave reviews
router.post('/', authenticate, authorizeRoles('user'), validate(reviewSchema), reviewController.createReview);

module.exports = router;
