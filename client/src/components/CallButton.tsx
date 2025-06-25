import { VideoIcon } from "lucide-react";
import { Button } from "./ui/button";

function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
      <Button
        onClick={handleVideoCall}
        className="bg-green-600 text-sm rounded-lg text-white"
      >
        <VideoIcon className="size-6    " />
      </Button>
    </div>
  );
}

export default CallButton;
