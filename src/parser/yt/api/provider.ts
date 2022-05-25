import { Provider, ProviderName } from "@parser/std";
import { getChannel } from "./endpoints/browse";

const provider: Provider = {
  getChannel: async (channelId) => ({
    provider: ProviderName.YT,
    id: channelId,

  })
}
