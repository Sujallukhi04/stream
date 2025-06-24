import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import useAuthUser from "@/hook/useAuthUser";
import { LANGUAGES } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "@/lib/api";
import { toast } from "sonner";
import { CameraIcon, ShuffleIcon } from "lucide-react";

function Onboarding() {
  const { authUser } = useAuthUser();

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const queryClient = useQueryClient();

  const { mutate: onboardMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onboardMutation(formData);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormData({ ...formData, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-lg mx-auto p-6 shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Profile Picture */}
              <div className="h-32 w-32 rounded-full bg-accent overflow-hidden">
                {formData.profilePic ? (
                  <img
                    src={formData.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleRandomAvatar}
                  variant={"outline"}
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </Button>
              </div>
            </div>
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Write a short bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>

            {/* Language Selects - Responsive Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Native Language */}
              <div className="space-y-1">
                <Label>Native Language</Label>
                <Select
                  value={formData.nativeLanguage}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      nativeLanguage: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your native language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang.toLowerCase()}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Learning Language */}
              <div className="space-y-1">
                <Label>Learning Language</Label>
                <Select
                  value={formData.learningLanguage}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      learningLanguage: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your learning language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang.toLowerCase()}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {isPending ? "Completing..." : "Complete Onboarding"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Onboarding;
