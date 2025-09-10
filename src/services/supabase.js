import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ziidqqsxgdfuhgcwnnzi.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppaWRxcXN4Z2RmdWhnY3dubm56aSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM2Mzk2NDU5LCJleHAiOjIwNTE5NzI0NTl9.EnrmiFaZqiK7cyWht3PAWw_B8weynMZQTpTgYGJqrQk'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin authentication functions
export const adminAuth = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    if (adminError || !adminData) {
      await supabase.auth.signOut()
      throw new Error('Access denied: Admin privileges required')
    }
    
    return { user: data.user, admin: adminData }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    // Check admin status
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return adminData ? { user, admin: adminData } : null
  }
}

// Database functions
export const db = {
  // User management
  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateUserSubscription(userId, subscriptionData) {
    const { data, error } = await supabase
      .from('profiles')
      .update(subscriptionData)
      .eq('id', userId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteUser(userId) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (error) throw error
  },

  // Subscription management
  async getSubscriptions() {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        profiles:user_id (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Analytics
  async getAnalytics() {
    const [usersCount, subscriptionsCount, activeSubscriptions] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
    ])

    return {
      totalUsers: usersCount.count || 0,
      totalSubscriptions: subscriptionsCount.count || 0,
      activeSubscriptions: activeSubscriptions.count || 0
    }
  }
}
