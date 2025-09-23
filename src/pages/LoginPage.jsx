import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, LogIn, Eye, EyeOff, Shield, Settings } from "lucide-react";
import authService from '../services/auth.js';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			await authService.login(email, password);
			navigate('/');
		} catch (error) {
			console.error("Login failed:", error);
			setError(error.response?.data?.message || error.message || 'Login failed');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-900">
			
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden">
				<motion.div
					className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 opacity-5 rounded-full"
					animate={{
						scale: [1, 1.2, 1],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: "linear"
					}}
				/>
				<motion.div
					className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-400 opacity-3 rounded-full"
					animate={{
						scale: [1.2, 1, 1.2],
						rotate: [360, 180, 0],
					}}
					transition={{
						duration: 25,
						repeat: Infinity,
						ease: "linear"
					}}
				/>
				<motion.div
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500 opacity-2 rounded-full"
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.02, 0.05, 0.02],
					}}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				/>
			</div>

			<div className='max-w-md w-full space-y-8 relative z-10'>
				{/* Glassmorphism Card */}
				<motion.div
					initial={{ opacity: 0, y: 50, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="bg-gray-800 bg-opacity-80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700 border-opacity-50 shadow-2xl"
				>
					{/* Header Section */}
					<div className="text-center mb-8">
						<motion.div
							initial={{ opacity: 0, y: -30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className="flex justify-center items-center mb-6"
						>
							<div className="relative">
								<div className="w-16 h-16 bg-gray-700 bg-opacity-60 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-gray-600 border-opacity-50">
									<Shield className="w-8 h-8 text-orange-400" />
								</div>
								<motion.div
									className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 2, repeat: Infinity }}
								>
									<Settings className="w-3 h-3 text-white" />
								</motion.div>
							</div>
						</motion.div>
						
						<motion.h1
							className="text-3xl font-bold text-white mb-2 tracking-wide"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3, duration: 0.5 }}
						>
							RX LIFESTYLE
						</motion.h1>
						
						<motion.div
							className="flex items-center justify-center space-x-2 mb-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.5 }}
						>
							<div className="w-2 h-2 bg-orange-400 bg-opacity-80 rounded-full"></div>
							<p className="text-gray-300 font-medium">Admin Panel</p>
							<div className="w-2 h-2 bg-orange-400 bg-opacity-80 rounded-full"></div>
						</motion.div>

						<motion.h2
							className="text-xl font-semibold text-white mb-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.5 }}
						>
							Welcome Back
						</motion.h2>
						
						<motion.p
							className="text-gray-400 text-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.5 }}
						>
							Sign in to access your admin dashboard
						</motion.p>
					</div>
					{/* Form Section */}
					<motion.form
						className='space-y-6'
						onSubmit={handleSubmit}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7, duration: 0.5 }}
					>
						{error && (
							<motion.div 
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="bg-red-900 bg-opacity-60 border border-red-700 border-opacity-50 text-red-200 px-4 py-3 rounded-2xl backdrop-blur-sm text-sm font-medium"
							>
								⚠️ {error}
							</motion.div>
						)}

						<div className='space-y-5'>
							{/* Email Field */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.8, duration: 0.4 }}
							>
								<label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-2'>
									Email Address
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
										<User className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id='email'
										name='email'
										type='email'
										autoComplete='email'
										required
										className="w-full px-4 py-4 pl-12 bg-gray-700 bg-opacity-50 border border-gray-600 border-opacity-50 text-white placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 focus:border-orange-500 backdrop-blur-sm transition-all duration-300 text-sm font-medium"
										placeholder='Enter your admin email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</motion.div>

							{/* Password Field */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.9, duration: 0.4 }}
							>
								<label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-2'>
									Password
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id='password'
										name='password'
										type={showPassword ? "text" : "password"}
										autoComplete='current-password'
										required
										className="w-full px-4 py-4 pl-12 pr-12 bg-gray-700 bg-opacity-50 border border-gray-600 border-opacity-50 text-white placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 focus:border-orange-500 backdrop-blur-sm transition-all duration-300 text-sm font-medium"
										placeholder='Enter your password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
									<div className='absolute inset-y-0 right-0 pr-4 flex items-center'>
										<button
											type="button"
											className="text-gray-400 hover:text-orange-400 focus:outline-none transition-all duration-200 p-1 rounded-lg hover:bg-gray-600 hover:bg-opacity-50"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Submit Button */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.0, duration: 0.4 }}
							className="pt-2"
						>
							<motion.button
								type='submit'
								disabled={isLoading}
								className='group relative w-full flex justify-center py-4 px-6 border-2 border-orange-500 border-opacity-60 text-base font-semibold rounded-2xl text-white bg-orange-500 bg-opacity-80 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm transition-all duration-300'
								whileHover={{ scale: 1.02, y: -2 }}
								whileTap={{ scale: 0.98 }}
							>
								<span className='absolute left-0 inset-y-0 flex items-center pl-4'>
									{isLoading ? (
										<motion.div
											animate={{ rotate: 360 }}
											transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
											className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
										/>
									) : (
										<LogIn className='h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200' />
									)}
								</span>
								{isLoading ? "Signing in..." : "Sign In to Admin Panel"}
							</motion.button>
						</motion.div>

						{/* Footer */}
						<motion.div 
							className="text-center pt-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.1, duration: 0.4 }}
						>
							<div className="flex items-center justify-center space-x-2 mb-3">
								<div className="w-8 h-px bg-gray-600"></div>
								<p className="text-gray-400 text-xs font-medium">SECURE ACCESS</p>
								<div className="w-8 h-px bg-gray-600"></div>
							</div>
							<p className="text-gray-500 text-xs">
								© 2025 RX Lifestyle Admin Panel. All rights reserved.
							</p>
						</motion.div>
					</motion.form>
				</motion.div>
			</div>
		</div>
	);
};

export default LoginPage;
