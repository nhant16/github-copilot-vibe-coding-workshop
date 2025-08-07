const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Resource not found');
        }
        if (response.status === 400) {
          throw new Error('Bad request - invalid input');
        }
        if (response.status >= 500) {
          throw new Error('Server error - please try again later');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Backend server is unavailable. Please check if the server is running.');
      }
      throw error;
    }
  }

  // Posts API
  async getPosts() {
    return this.request('/posts');
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async getPost(postId) {
    return this.request(`/posts/${postId}`);
  }

  async updatePost(postId, postData) {
    return this.request(`/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Comments API
  async getComments(postId) {
    return this.request(`/posts/${postId}/comments`);
  }

  async createComment(postId, commentData) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async getComment(postId, commentId) {
    return this.request(`/posts/${postId}/comments/${commentId}`);
  }

  async updateComment(postId, commentId, commentData) {
    return this.request(`/posts/${postId}/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(postId, commentId) {
    return this.request(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Likes API
  async likePost(postId, likeData) {
    return this.request(`/posts/${postId}/likes`, {
      method: 'POST',
      body: JSON.stringify(likeData),
    });
  }

  async unlikePost(postId) {
    return this.request(`/posts/${postId}/likes`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
