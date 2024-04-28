import axiosInstance from '../axios';
import { AxiosResponse } from 'axios';

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
      .delete<
        void,
        AxiosResponse<void>
      >(`/v1/comments/${commentId}/reactions/${reactionId}`)
      .then((res) => res.data),
};
