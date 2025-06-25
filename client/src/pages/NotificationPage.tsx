import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import NoNotificationsFound from "@/components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-6 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with your friend requests and connections
        </p>
      </div>

      {/* Friend Requests Section */}
      {incomingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheckIcon className="h-5 w-5 text-primary" />
              Friend Requests
              <Badge variant="default" className="ml-2 rounded-full   ">
                {incomingRequests.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              People who want to connect with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {incomingRequests.map((request, index) => (
              <div key={request.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={request.sender.profilePic}
                        alt={request.sender.fullName}
                      />
                      <AvatarFallback>
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="font-medium leading-none">
                        {request.sender.fullName}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Native: {request.sender.nativeLanguage}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Learning: {request.sender.learningLanguage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => acceptRequestMutation(request.id)}
                    disabled={isPending}
                  >
                    {isPending ? "Accepting..." : "Accept"}
                  </Button>
                </div>
                {index < incomingRequests.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Accepted Requests Section */}
      {acceptedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="h-5 w-5 text-green-600" />
              New Connections
            </CardTitle>
            <CardDescription>Recent friend request acceptances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {acceptedRequests.map((notification, index) => (
              <div key={notification.id} className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 mt-1">
                    <AvatarImage
                      src={notification.recipient.profilePic}
                      alt={notification.recipient.fullName}
                    />
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium leading-none">
                      {notification.recipient.fullName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.recipient.fullName} accepted your friend
                      request
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      Recently
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    <MessageSquareIcon className="h-3 w-3 mr-1" />
                    New Friend
                  </Badge>
                </div>
                {index < acceptedRequests.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <BellIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No notifications yet</h3>
              <p className="text-muted-foreground">
                When you receive friend requests or notifications, they'll
                appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
