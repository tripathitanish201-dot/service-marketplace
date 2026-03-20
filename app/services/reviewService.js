const reviewRepository = require('../repositories/reviewRepository');
const userRepository = require('../repositories/userRepository');

class ReviewService {
  async addReview(userId, providerId, rating, comment) {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Ensure the provider actually exists
    const provider = await userRepository.getUserById(providerId);
    if (!provider || provider.role !== 'provider') {
      throw new Error('Target user is not a valid provider');
    }

    const reviewId = await reviewRepository.createReview({
      user_id: userId,
      provider_id: providerId,
      rating,
      comment
    });

    return { id: reviewId, user_id: userId, provider_id: providerId, rating, comment };
  }

  async getProviderReviews(providerId) {
    const reviews = await reviewRepository.getReviewsForProvider(providerId);
    const stats = await reviewRepository.getProviderRatingStats(providerId);
    
    return {
      reviews,
      averageRating: stats.average_rating ? parseFloat(stats.average_rating).toFixed(1) : 0,
      totalReviews: stats.total_reviews
    };
  }
}

module.exports = new ReviewService();
