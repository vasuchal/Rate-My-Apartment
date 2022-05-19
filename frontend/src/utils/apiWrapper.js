import axios from 'axios';

// Allow cross-origin requests

const instance = axios.create({
  baseURL: 'http://localhost:9000',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true,
});

export const testConnection = () => instance.get('/');

export const getAllApartments = (opts) =>
  instance.get('/routes/api/apartments', {
    params: opts,
  });

export const getApartmentsByState = (state) =>
  instance.get(`/routes/api/state/${state}`);

export const getApartmentsByName = (name) =>
  instance.get(`/routes/api/apartments/name/${name}`);

export const getApartmentById = (id) =>
  instance.get(`/routes/api/apartments/${id}`);

export const getAllComments = () => instance.get('/routes/api/comments');

export const getCommentsForApartment = (aptId) =>
  instance.get(`/routes/api/comments/apartment/${aptId}`);

export const getResidentCommentsForApartment = (aptId) =>
  instance.get(`/routes/api/comments/resident/${aptId}`);

export const getAllManagements = () => instance.get('/routes/api/managements');

export const getManagementScore = (name) =>
  instance.get(`/routes/api/managements/score/${name}`);

export const getAllResidents = () => instance.get('/routes/api/residents');

export const getReviewForApartment = (aptId) =>
  instance.get(`/routes/api/reviews/${aptId}`);

// Delete comment from the api
export const deleteComment = (id) =>
  instance.delete(`/routes/api/comments/${id}`);

// Add comment to the api
export const addComment = (comment) =>
  instance.post('/routes/api/comments', comment);

// Update comment in the api
export const updateComment = (comment) =>
  instance.put(`/routes/api/comments/${comment.id}`, comment);

export const getComment = (commentId) => instance.get(`/comment/${commentId}`);

// export const updateApartment = (id, apartment) => instance.put(`/apartments/${id}`, apartment);

// export const deleteApartment = (id) => instance.delete(`/apartments/${id}`);

export const getCurrentUser = () => instance.get('/routes/api/auth/me');

export const logoutUser = () => instance.get('/routes/api/auth/logout');

export const createUser = (user) =>
  instance.post('/routes/api/auth/create', user);

export const loginUser = (user) =>
  instance.post('/routes/api/auth/login', user);

  export const loadTopManagementRating = () => instance.get('/routes/api/comments/top/procedure');