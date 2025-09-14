import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Star, Lock, TrendingUp, User } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import { ownerAPI, authAPI } from '../api';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    store: {},
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await ownerAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    dashboardData.ratings.forEach(rating => {
      distribution[rating.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const maxCount = Math.max(...Object.values(ratingDistribution));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Store Owner Dashboard</h1>
            <p className="text-muted-foreground">Monitor your store's performance and ratings</p>
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

        {/* Store Info Card */}
        <Card className="p-6 mb-6 gradient-card">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <Store className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{dashboardData.store.name}</h2>
              <p className="text-muted-foreground mb-2">{dashboardData.store.address}</p>
              <p className="text-sm text-muted-foreground">{dashboardData.store.email}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-3xl font-bold text-foreground">
                  {dashboardData.averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {dashboardData.totalRatings} total ratings
              </p>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dashboard-card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Reviews</h3>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.totalRatings}</p>
              </div>
            </div>
          </Card>

          <Card className="dashboard-card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Average Rating</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {dashboardData.averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="dashboard-card">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData.ratings.filter(r => 
                    new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rating Distribution */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: maxCount > 0 ? `${(ratingDistribution[rating] / maxCount) * 100}%` : '0%'
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Ratings */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Ratings</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {dashboardData.ratings.length > 0 ? (
                dashboardData.ratings
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 10)
                  .map((rating) => (
                    <div key={rating._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{rating.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <RatingStars rating={rating.rating} readonly size="w-4 h-4" />
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No ratings yet</p>
                  <p className="text-sm text-muted-foreground">
                    Encourage customers to rate your store!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;