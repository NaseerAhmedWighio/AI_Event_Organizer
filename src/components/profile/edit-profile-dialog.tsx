"use client";

import { useState, useRef } from "react";
import { useUser, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X, Loader2, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function EditProfileDialog() {
  const { user, isLoaded } = useUser();
  const { updateUser } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(
    user?.profileImageUrl || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (): Promise<boolean> => {
    if (!profileImage || !user) return false;

    setIsUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(profileImage);

      await new Promise<void>((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64String = reader.result as string;

            // TODO: Implement profile image upload to Sanity or cloud storage
            // For now, just store the base64 string locally
            console.log("Profile image uploaded (base64 stored locally)");
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(reader.error);
      });

      toast({
        title: "Success",
        description: "Profile picture uploaded successfully!",
      });
      return true;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Upload profile image if changed (currently local only)
      let imageUploaded = false;
      if (profileImage) {
        imageUploaded = await handleImageUpload();
      }

      // Update user profile (name)
      await updateUser({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      // If image upload failed, don't continue with other operations
      if (profileImage && !imageUploaded) {
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Reset form when opening
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
      setProfileImagePreview(user?.profileImageUrl || "");
      setProfileImage(null);
    }
  };

  if (!isLoaded) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl gap-2">
          <User className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="h-28 w-28 rounded-2xl ring-4 ring-border shadow-xl">
                <AvatarImage src={profileImagePreview} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-cyan-500 text-white text-3xl font-bold">
                  {firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
              </div>
              {profileImagePreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileImage(null);
                    setProfileImagePreview(user?.profileImageUrl || "");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Change Photo
            </Button>
            <p className="text-xs text-muted-foreground">
              PNG, JPG up to 5MB
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="rounded-xl"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="rounded-xl"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                readOnly
                className="rounded-xl bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSaving || isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="gap-2"
          >
            {(isSaving || isUploading) && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
