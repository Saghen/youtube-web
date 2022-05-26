import { Provider } from "parser/std";

export const makeProvider = (): Provider => ({
  getRecommended

  // TODO:
  getPlayer
  getVideo
  listVideos
  setVideoLikeStatus

  getUser
  listFollowedUsers
  listLiveFollowedUsers
  setUserFollowed

  getPlaylist
  listPlaylists

  getChannel

  getComment
  listComments

  search
})
