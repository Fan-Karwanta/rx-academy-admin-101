import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, LogIn, Eye, EyeOff } from "lucide-react";
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
		<div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
			<div className='max-w-md w-full space-y-8'>
				<div>
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='mx-auto flex justify-center mb-8'
					>
						<div className="text-center">
							<h1 className="text-4xl font-bold text-white mb-2">RX LIFESTYLE</h1>
							<p className="text-gray-400">Admin Panel</p>
						</div>
					</motion.div>
					<motion.h2
						className="mt-6 text-center text-3xl font-extrabold text-white"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						Sign in to your account
					</motion.h2>
					<motion.p
						className="mt-2 text-center text-sm text-gray-400"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						Access your admin dashboard
					</motion.p>
				</div>
				<motion.form
					className='mt-8 space-y-6'
					onSubmit={handleSubmit}
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.5 }}
				>
					{error && (
						<div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded relative">
							{error}
						</div>
					)}

					<div className='space-y-4'>
						<div>
							<label htmlFor='email' className='sr-only'>
								Email
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id='email'
									name='email'
									type='email'
									autoComplete='email'
									required
									className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
									placeholder='Email Address'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<label htmlFor='password' className='sr-only'>
								Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id='password'
									name='password'
									type={showPassword ? "text" : "password"}
									autoComplete='current-password'
									required
									className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
									placeholder='Password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
									<button
										type="button"
										className="text-gray-400 hover:text-gray-300 focus:outline-none"
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
						</div>
					</div>

					<div>
						<motion.button
							type='submit'
							disabled={isLoading}
							className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300'
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<span className='absolute left-0 inset-y-0 flex items-center pl-3'>
								<LogIn className='h-5 w-5 text-gray-600' />
							</span>
							{isLoading ? "Signing in..." : "Sign in"}
						</motion.button>
					</div>

					<div className="text-center text-sm text-gray-400">
						<p>2025 © RX Admin Panel. All rights reserved.</p>
					</div>
				</motion.form>
			</div>
		</div>
	);
};

export default LoginPage;
