import { Card, CardContent } from "./ui/card";

const NoFriendsFound = () => {
  return (
    <Card className="p-6 text-center">
      <CardContent className="p-0">
        <h3 className="font-semibold text-lg mb-2">No friends yet</h3>
        <p className="text-muted-foreground">
          Connect with language partners below to start practicing together!
        </p>
      </CardContent>
    </Card>
  );
};

export default NoFriendsFound;
