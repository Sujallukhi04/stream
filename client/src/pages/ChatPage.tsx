import CallButton from "@/components/CallButton";
import ChatLoader from "@/components/ChatLoader";
import useAuthUser from "@/hook/useAuthUser";
import { getStreamToken } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: userId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!authUser || !tokenData.token) return;

      try {
        console.log("stream client  initializing");

        const client = await StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser.id,
            name: authUser.name,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser.id, userId].sort().join("-");

        const currchannel = client.channel("messaging", channelId, {
          members: [authUser.id, userId],
        });

        await currchannel.watch();

        setChatClient(client);
        setChannel(currchannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, userId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] w-full">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
