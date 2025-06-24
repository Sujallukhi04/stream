import { LANGUAGE_TO_FLAG } from "@/constants";
import { Link } from "react-router";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const FriendCard = ({ friend }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12 ">
            <AvatarImage
              src={friend?.profilePic}
              alt={friend?.fullName || "User Avatar"}
            />
            <AvatarFallback className="bg-accent rounded-full w-full h-full text-accent-foreground font-medium flex items-center justify-center">
              {friend?.fullName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="secondary" className="text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </Badge>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link to={`/chat/${friend.id}`}>Message</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
export default FriendCard;

export function getLanguageFlag(language: string | null) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
