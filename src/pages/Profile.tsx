import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useImageUpload } from '@/hooks/useImageUpload';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Camera, User, Mail, Phone, FileText, KeyRound, Trash2, Shield, Settings } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const { uploadImage, uploading } = useImageUpload('avatars');
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone: '',
    bio: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [profile.username, profile.full_name, profile.phone, profile.bio, profile.avatar_url];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file, 'profiles');
      if (imageUrl) {
        await updateProfile.mutateAsync({ avatar_url: imageUrl });
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <ErrorMessage
            message={`Failed to load profile: ${error.message || 'Unknown error'}. Please try again.`}
            onRetry={() => window.location.reload()}
          />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground mt-2">Manage your personal information</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Profile Completion</span>
                  <span>{calculateProfileCompletion()}%</span>
                </div>
                <Progress value={calculateProfileCompletion()} className="w-full" />
              </div>
            </div>

            {/* Profile Tabs */}
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Profile Information
                      <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group"> {/* Added group class for hover effect */}
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="text-2xl">
                        {profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label 
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"  // Added transition
                      >
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <LoadingSpinner />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">
                      {profile?.full_name || 'User'}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge variant={profile?.role === 'admin' ? 'destructive' : 'secondary'}>
                        {profile?.role || 'user'}
                      </Badge>
                      {profile?.is_verified && (
                        <Badge variant="default">Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Enter username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit" 
                        disabled={updateProfile.isPending}
                        className="flex-1"
                      >
                        {updateProfile.isPending ? <LoadingSpinner /> : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Change Password */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Change Password</h4>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">Current Password</Label>
                        <Input id="current_password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new_password">New Password</Label>
                        <Input id="new_password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirm New Password</Label>
                        <Input id="confirm_password" type="password" />
                      </div>
                      <Button type="submit">Update Password</Button>
                    </form>
                  </div>

                  {/* Account Info */}
                  <div className="pt-6 border-t">
                    <h4 className="font-semibold mb-4">Account Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Account created: {new Date(profile?.created_at || '').toLocaleDateString()}</p>
                      <p>Last updated: {new Date(profile?.updated_at || '').toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Preferences settings will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;
