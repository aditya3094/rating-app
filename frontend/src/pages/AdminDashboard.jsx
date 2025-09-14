import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, Store, Star, Plus, Search, Filter, Eye } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import { adminAPI } from '../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    sortBy: 'name',
  });
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
  });
  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers(filters);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await adminAPI.getStores(filters);
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.addUser(newUser);
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.addStore(newStore);
      setShowAddStore(false);
      setNewStore({ name: '', email: '', address: '' });
      fetchStores();
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding store:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const response = await adminAPI.getUserDetails(userId);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, stores, and monitor system activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dashboard-card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="dashboard-card">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Store className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Stores</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalStores}</p>
              </div>
            </div>
          </Card>

          <Card className="dashboard-card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Ratings</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.totalRatings}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 mb-6">
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label htmlFor="userName">Name</Label>
                  <Input
                    id="userName"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Full name (20-60 chars)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="userPassword">Password</Label>
                  <Input
                    id="userPassword"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="8-16 chars, 1 uppercase, 1 special"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="userAddress">Address</Label>
                  <Textarea
                    id="userAddress"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    placeholder="User address (max 400 chars)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="userRole">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Normal User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="store_owner">Store Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading} className="w-full btn-primary">
                  {loading ? 'Adding...' : 'Add User'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddStore} onOpenChange={setShowAddStore}>
            <DialogTrigger asChild>
              <Button className="btn-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Add Store
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Store</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStore} className="space-y-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    placeholder="Store name (20-60 chars)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={newStore.email}
                    onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                    placeholder="Store email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="storeAddress">Address</Label>
                  <Textarea
                    id="storeAddress"
                    value={newStore.address}
                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                    placeholder="Store address (max 400 chars)"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full btn-primary">
                  {loading ? 'Adding...' : 'Add Store'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Role Filter</Label>
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="user">Normal User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="store_owner">Store Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="address">Address</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => viewUserDetails(user._id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Stores Table */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Stores</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stores.map((store) => (
                <div key={store._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{store.name}</p>
                    <RatingStars rating={store.averageRating || 0} readonly size="w-4 h-4" />
                  </div>
                  <p className="text-sm text-muted-foreground">{store.email}</p>
                  <p className="text-xs text-muted-foreground">{store.address}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm">{selectedUser.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <p className="text-sm capitalize">{selectedUser.role.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <p className="text-sm">{selectedUser.address}</p>
                  </div>
                </div>
                
                {selectedUser.role === 'store_owner' && selectedUser.ratings && (
                  <div>
                    <Label>Store Ratings</Label>
                    <div className="space-y-2 mt-2">
                      {selectedUser.ratings.map((rating) => (
                        <div key={rating._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{rating.userName}</span>
                          <RatingStars rating={rating.rating} readonly size="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;