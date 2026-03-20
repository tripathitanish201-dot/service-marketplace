const reviewService = require('../services/reviewService');

class ReviewController {
  async createReview(req, res) {
    try {
      const userId = req.user.id;
      const { provider_id, rating, comment } = req.body;

      if (!provider_id || !rating) {
        return res.status(400).json({ message: 'provider_id and rating are required' });
      }

      const review = await reviewService.addReview(userId, provider_id, rating, comment);
      res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProviderReviews(req, res) {
    try {
      const providerId = req.params.providerId;
      const data = await reviewService.getProviderReviews(providerId);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ReviewController();
