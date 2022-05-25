const getRecommended = async function* () {
  await fetch(`https://www.youtube.com/youtubei/v1/next`, {
    headers: {
      authorization: 'SAPISIDHASH 1653504097_d4bb35c5d98c6543282a50bff46be14555c8fe10',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      context: getContext(),
      browseId: 'FEwhat_to_watch',
    }),
    method: 'POST',
    credentials: 'include',
  }).then((res) => res.json())
}

export enum BrowseId {
  // Should be unneeded because of guide
  // Subscribed = 'FEchannels',
  Recommended = 'FEwhat_to_watch',
  History = 'FEhistory',
}

/** Must be escaped and converted to base64 */
export enum BrowseParams {
  ChannelHome = '\x12\bfeatured',
  ChannelVideos = '\x12\x06videos',
  ChannelPlaylists = '\x12\tplaylists',
  ChannelCommunity = '\x12\tcommunity',
  ChannelChannels = '\x12\bchannels',
  ChannelAbout = '\x12\x05about',
}
