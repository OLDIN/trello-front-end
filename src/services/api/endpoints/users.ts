import axios from '../axios';

export default {
  list: () => axios.get('/v1/users'),
};
