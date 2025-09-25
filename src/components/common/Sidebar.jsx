import { BarChart2, Menu, Users, LogOut, Archive, CreditCard } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from '../../services/auth.js';

const SIDEBAR_ITEMS = [
	{
		name: "Dashboard",
		icon: BarChart2,
		color: "#ffffff",
		href: "/",
	},
	{ 
		name: "User Management", 
		icon: Users, 
		color: "#ffffff", 
		href: "/users" 
	},
	{ 
		name: "Subs Confirmations", 
		icon: CreditCard, 
		color: "#ffffff", 
		href: "/subscriptions" 
	},
	{ 
		name: "Archive Storage", 
		icon: Archive, 
		color: "#ffffff", 
		href: "/archive" 
	},
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await authService.logout();
			navigate('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<>
			<motion.div
				className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
					isSidebarOpen ? "w-64" : "w-20"
				}`}
				animate={{ width: isSidebarOpen ? 256 : 80 }}
			>
				<div className="h-full bg-gray-900 border-gray-800 p-4 flex flex-col border-r">
					{/* Hamburger menu button */}
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className="p-2 rounded-full hover:bg-gray-800 transition-colors max-w-fit mb-4"
					>
						<Menu size={24} className="text-white" />
					</motion.button>
					
					<AnimatePresence>
						{isSidebarOpen && (
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								className='flex items-center justify-center mb-8'
							>
								<div className="text-center">
									<h1 className="text-2xl font-bold text-white">RX LIFESTYLE</h1>
									<p className="text-gray-400 text-sm">Admin Panel</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<nav className='mt-2 flex-grow'>
						{SIDEBAR_ITEMS.map((item) => {
							const isActive = location.pathname === item.href;
							return (
								<Link key={item.href} to={item.href}>
									<motion.div className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
										isActive 
											? 'bg-white text-black' 
											: 'hover:bg-gray-800 text-white'
									}`}>
										<item.icon size={20} style={{ color: isActive ? "#000000" : item.color, minWidth: "20px" }} />
										<AnimatePresence>
											{isSidebarOpen && (
												<motion.span
													className={`ml-4 whitespace-nowrap ${isActive ? 'text-black' : 'text-white'}`}
													initial={{ opacity: 0, width: 0 }}
													animate={{ opacity: 1, width: "auto" }}
													exit={{ opacity: 0, width: 0 }}
													transition={{ duration: 0.2, delay: 0.3 }}
												>
													{item.name}
												</motion.span>
											)}
										</AnimatePresence>
									</motion.div>
								</Link>
							);
						})}
					</nav>

					{/* Logout button */}
					<button 
						onClick={() => setShowLogoutModal(true)}
						className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors mt-auto text-white"
					>
						<LogOut size={20} style={{ color: "#EF4444", minWidth: "20px" }} />
						<AnimatePresence>
							{isSidebarOpen && (
								<motion.span
									className="ml-4 whitespace-nowrap text-white"
									initial={{ opacity: 0, width: 0 }}
									animate={{ opacity: 1, width: "auto" }}
									exit={{ opacity: 0, width: 0 }}
									transition={{ duration: 0.2, delay: 0.3 }}
								>
									Logout
								</motion.span>
							)}
						</AnimatePresence>
					</button>
				</div>
			</motion.div>

			{/* Logout Confirmation Modal */}
			{showLogoutModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-gray-900 rounded-lg p-6 w-96">
						<h2 className="text-xl font-bold text-white mb-4">Confirm Logout</h2>
						<p className="text-gray-400 mb-6">Are you sure you want to logout?</p>
						<div className="flex justify-end space-x-4">
							<button
								onClick={() => setShowLogoutModal(false)}
								className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
							>
								Cancel
							</button>
							<button
								onClick={handleLogout}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default Sidebar;
