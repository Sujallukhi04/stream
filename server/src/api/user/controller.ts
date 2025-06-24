import { Request, Response } from "express";
import { db } from "../../prismaClient";
import { getUserById } from "../../utils/user";

export const getRecommandedUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const currentUser = await db.user.findUnique({
      where: { id: currentUserId },
      include: {
        sentRequests: true,
        receivedRequests: true,
      },
    });

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const excludeIds = new Set<string>([
      currentUserId!,
      ...(currentUser.friendIds ?? []),
      ...(currentUser.friendOfIds ?? []),
      ...(currentUser.sentRequests?.map((r) => r.recipientId) ?? []),
      ...(currentUser.receivedRequests?.map((r) => r.senderId) ?? []),
    ]);

    const recommandedUsers = await db.user.findMany({
      where: {
        id: { notIn: Array.from(excludeIds) },
        isOnboarded: true,
      },
    });

    res.status(200).json(recommandedUsers);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyFriends = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.user?.id,
      },
      include: {
        friends: true,
        friendOf: true,
      },
    });

    const friendIds = new Set<string>([
      ...(user?.friendIds ?? []),
      ...(user?.friendOfIds ?? []),
    ]);

    const friends = await db.user.findMany({
      where: {
        id: { in: Array.from(friendIds) },
      },
      select: {
        id: true,
        fullName: true,
        profilePic: true,
        nativeLanguage: true,
        learningLanguage: true,
      },
    });

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id: recipientId } = req.params;

    if (userId === recipientId) {
      res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
      return;
    }

    const recipient = await getUserById(recipientId);
    if (!recipient) {
      res.status(404).json({ message: "Recipient not found" });
      return;
    }

    if (
      recipient.friendIds.includes(userId!) ||
      recipient.friendOfIds.includes(userId!)
    ) {
      res
        .status(400)
        .json({ message: "You are already friends with this user" });
      return;
    }

    const existingRequest = await db.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, recipientId },
          { senderId: recipientId, recipientId: userId },
        ],
      },
    });

    if (existingRequest) {
      res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
      return;
    }

    const friendRequest = await db.friendRequest.create({
      data: {
        senderId: userId!,
        recipientId,
      },
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await db.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      res.status(404).json({ message: "Friend request not found" });
      return;
    }

    if (friendRequest.recipientId !== req.user?.id) {
      res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
      return;
    }

    await db.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });

    await db.$transaction([
      db.user.update({
        where: { id: friendRequest.senderId },
        data: {
          friendIds: {
            push: [friendRequest.recipientId],
          },
          friendOfIds: {
            push: [friendRequest.recipientId],
          },
        },
      }),
      db.user.update({
        where: { id: friendRequest.recipientId },
        data: {
          friendIds: {
            push: [friendRequest.senderId],
          },
          friendOfIds: {
            push: [friendRequest.senderId],
          },
        },
      }),
    ]);

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const incomingReqs = await db.friendRequest.findMany({
      where: { recipientId: userId, status: "PENDING" },
      include: {
        sender: {
          select: {
            fullName: true,
            profilePic: true,
            nativeLanguage: true,
            learningLanguage: true,
          },
        },
      },
    });

    const acceptedRequests = await db.friendRequest.findMany({
      where: { senderId: userId, status: "ACCEPTED" },
      include: {
        recipient: {
          select: {
            fullName: true,
            profilePic: true,
          },
        },
      },
    });

    res.status(200).json({ incomingReqs, acceptedRequests });
  } catch (error) {
    console.error("Error in getFriendRequests controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOutgoingFriendReqs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const outgoingReqs = await db.friendRequest.findMany({
      where: { senderId: userId, status: "PENDING" },
      include: {
        recipient: {
          select: {
            fullName: true,
            profilePic: true,
            nativeLanguage: true,
            learningLanguage: true,
          },
        },
      },
    });

    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
