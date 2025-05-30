
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/ui-components/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, CreditCard, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { useQuery } from '@tanstack/react-query';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
}

const ProfilePage = () => {
  const { toast } = useToast();
  const { balance } = useWallet();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
  });
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        throw new Error('No authenticated user found');
      }
      
      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', authUser.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }
      
      // Set user data
      return {
        fullName: profileData?.full_name || '',
        email: authUser.email || '',
        phone: profileData?.phone || '',
      };
    }
  });
  
  // Set form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSaveProfile = async () => {
    try {
      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Error",
          description: "Not authenticated",
          variant: "destructive"
        });
        return;
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authUser.id);
        
      if (error) {
        throw error;
      }
      
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
      // Navigate to welcome page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: error.message || "There was an error logging out.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer className="pb-20">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarFallback className="bg-primary text-white text-xl">
            {formData.fullName ? formData.fullName.split(' ').map(name => name[0]).join('') : '?'}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{formData.fullName || 'User'}</h2>
        <p className="text-muted-foreground">{formData.email}</p>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              disabled
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button
              className="flex-1"
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setFormData(user || { fullName: '', email: '', phone: '' });
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-4 mb-4">
            <h3 className="font-medium mb-3 flex items-center">
              <User size={18} className="mr-2 text-primary" />
              Personal Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{formData.fullName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{formData.phone || 'Not set'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <CreditCard size={18} className="mr-2 text-primary" />
              Wallet Information
            </h3>
            
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="font-medium text-xl text-primary">{balance.toLocaleString()} DZD</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={() => setIsEditing(true)}
          >
            <Settings size={16} className="mr-2" />
            Edit Profile
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={() => window.location.href = '/wallet'}
          >
            <CreditCard size={16} className="mr-2" />
            Wallet & Payments
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      )}
    </PageContainer>
  );
};

export default ProfilePage;
