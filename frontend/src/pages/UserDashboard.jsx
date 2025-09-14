import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, MapPin, Star, Lock, Edit } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import { userAPI, authAPI } from '../api';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    address: '',
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchStores();
    fetchUserRatings();
  }, [searchFilters]);

  const fetchStores = async () => {
    try {
      const response = await userAPI.getStores(searchFilters);
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await userAPI.getUserRatings();
      const ratingsMap = {};
      response.data.forEach(rating => {
        ratingsMap[rating.storeId] = rating;
      });
      setUserRatings(ratingsMap);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      const existingRating = userRatings[storeId];
      
      if (existingRating) {
        await userAPI.updateRating(existingRating._id, { rating });
      } else {
        await userAPI.submitRating({ storeId, rating });
      }
      
      fetchUserRatings();
      fetchStores(); // Refresh to update average ratings
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Store Directory</h1>
            <p className="text-muted-foreground">Rate and review stores in your area</p>
          </div>
          <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="8-16 chars, 1 uppercase, 1 special"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full btn-primary">
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Filters */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Search Stores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="storeName"
                  placeholder="Search by store name..."
                  value={searchFilters.name}
                  onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="storeAddress">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="storeAddress"
                  placeholder="Search by address..."
                  value={searchFilters.address}
                  onChange={(e) => setSearchFilters({ ...searchFilters, address: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => {
            const userRating = userRatings[store._id];
            
            return (
              <Card key={store._id} className="dashboard-card">
                <div className="space-y-4">
                  {/* Store Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {store.name}
                    </h3>
                    <div className="flex items-start space-x-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{store.address}</p>
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Overall Rating</p>
                      <RatingStars rating={store.averageRating || 0} readonly />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {store.totalRatings || 0} reviews
                      </p>
                    </div>
                  </div>

                  {/* User's Rating */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">Your Rating</p>
                      {userRating && (
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Edit className="w-3 h-3 mr-1" />
                          Click to update
                        </span>
                      )}
                    </div>
                    <RatingStars
                      rating={userRating?.rating || 0}
                      onRatingChange={(rating) => handleRating(store._id, rating)}
                    />
                    {userRating && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Rated on {new Date(userRating.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {stores.length === 0 && (
          <Card className="p-12 text-center">
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Stores Found</h3>
            <p className="text-muted-foreground">
              {searchFilters.name || searchFilters.address 
                ? 'Try adjusting your search criteria.' 
                : 'No stores are available at the moment.'
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;