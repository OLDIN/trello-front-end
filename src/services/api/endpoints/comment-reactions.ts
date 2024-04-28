import axiosInstance from '../axios';

export interface IAddCommentReactionPayload {
  reaction: string;
}

export default {
  add: (commentId: number, payload: IAddCommentReactionPayload) =>
    axiosInstance
      .post(`/v1/comments/${commentId}/reactions`, payload)
      .then((res) => res.data),
  delete: (commentId: number, reactionId: number) =>
    axiosInstance
      .delete(`/v1/comments/${commentId}/reactions/${reactionId}`)
      .then((res) => res.data),
};
