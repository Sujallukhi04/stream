import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "sonner";

const Home = () => {
  return (
    <div>
      <div className="">
        <Button onClick={() => toast.success("click successfully")}>
          Click
        </Button>
      </div>
    </div>
  );
};

export default Home;
