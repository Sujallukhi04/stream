import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircle,
  CheckCircleIcon,
  MapPin,
  MapPinIcon,
  UserPlus,
  UserPlusIcon,
  Users,
  UsersIcon,
} from "lucide-react";
import NoFriendsFound from "@/components/NotFriendFound";
import FriendCard, { getLanguageFlag } from "@/components/FriendCard";
import { capitialize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient.id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <div className="container mx-auto space-y-10">
        {/* Friends Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/notifications">
              <Users className="mr-2 w-4 h-4" />
              Friend Requests
            </Link>
          </Button>
        </div>

        {/* Friends Grid */}
        {loadingFriends ? (
          <LoadingSpinner />
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommended Users Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="text-muted-foreground">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <LoadingSpinner />
          ) : recommendedUsers.length === 0 ? (
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <h3 className="font-semibold text-lg mb-2">
                  No recommendations available
                </h3>
                <p className="text-muted-foreground">
                  Check back later for new language partners!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user.id);

                return (
                  <Card
                    key={user.id}
                    className="hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="px-5 space-y-4">
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 ">
                          <AvatarImage
                            src={user?.profilePic}
                            alt={user?.fullName || "User Avatar"}
                          />
                          <AvatarFallback className="bg-accent rounded-full w-full h-full text-accent-foreground font-medium flex items-center justify-center">
                            {user?.fullName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </Badge>
                        <Badge variant="outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </Badge>
                      </div>

                      {/* Bio */}
                      {user.bio && (
                        <p className="text-sm text-muted-foreground">
                          {user.bio}
                        </p>
                      )}

                      {/* Action button */}
                      <Button
                        className="w-full mt-2"
                        variant={hasRequestBeenSent ? "secondary" : "default"}
                        onClick={() => sendRequestMutation(user.id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
