const ReviewModel = require('../models/reviewModel');

class ReviewRepository {
  async createReview(reviewData) {
    return await ReviewModel.create(reviewData);
  }

  async getReviewsForProvider(providerId) {
    return await ReviewModel.findByProviderId(providerId);
  }

  async getProviderRatingStats(providerId) {
    return await ReviewModel.getAverageRating(providerId);
  }
}

module.exports = new ReviewRepository();
