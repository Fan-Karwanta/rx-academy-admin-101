import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminUpdateManager from "./utils/updateManager";

import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ArchiveStoragePage from "./pages/ArchiveStoragePage";
import SubscriptionConfirmationPage from "./pages/SubscriptionConfirmationPage";
import LoginPage from "./pages/LoginPage";

// Layout component for authenticated pages
const DashboardLayout = () => {
	return (
		<div className="flex h-screen overflow-hidden bg-black text-white">
			{/* Background */}
			<div className='fixed inset-0 z-0 pointer-events-none'>
				<div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95" />
			</div>

			<Sidebar />
			<main className="flex-1 overflow-auto z-10">
				<Outlet />
			</main>
		</div>
	);
};

function App() {
	useEffect(() => {
		// Initialize update manager for automatic updates
		const updateManager = new AdminUpdateManager();
		
		// Store reference globally for manual checks
		window.adminUpdateManager = updateManager;
		
		// Cleanup on unmount
		return () => {
			updateManager.destroy();
		};
	}, []);

	return (
		<Routes>
			{/* Public routes */}
			<Route path="/login" element={<LoginPage />} />
			
			{/* Protected routes */}
			<Route element={<ProtectedRoute />}>
				<Route element={<DashboardLayout />}>
					<Route path="/" element={<DashboardPage />} />
					<Route path="/users" element={<UsersPage />} />
					<Route path="/subscriptions" element={<SubscriptionConfirmationPage />} />
					<Route path="/archive" element={<ArchiveStoragePage />} />
				</Route>
			</Route>
			
			{/* Catch all route - redirect to login */}
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}

export default App;
