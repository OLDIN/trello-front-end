import axiosInstance from '../axios';

export default {
  deleteById: (taskId: number, commentId: number) =>
    axiosInstance
      .delete(`/v1/tasks/${taskId}/comments/${commentId}`)
      .then((res) => res.data),
};
