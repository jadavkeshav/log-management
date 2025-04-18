import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import axios from "axios";

function Signup() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validate password and confirmPassword match
		if (formData.password !== formData.confirmPassword) {
			alert("Passwords do not match");
			return;
		}
		// Add signup logic here

		axios
			.post(import.meta.env.VITE_BASE_URL + "/api/auth/register", {
				username: formData.name,
				email: formData.email,
				password: formData.password,
			})
			.then(({ data }) => {
				console.log(data);
				navigate("/login");
			})
			.catch((response) => {
				console.error(response);
				// Handle error (e.g., show a message to the user)
			});
		console.log("Signup:", formData);
		navigate("/login");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
				<div className="text-center">
					<div className="flex justify-center">
						<UserPlus className="h-12 w-12 text-blue-600" />
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
					<p className="mt-2 text-sm text-gray-600">
						Already have an account?{" "}
						<Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
							Sign in
						</Link>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<div className="relative">
							<label htmlFor="name" className="sr-only">
								Username
							</label>
							<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input id="name" name="name" type="text" required className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Username" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
						</div>
						<div className="relative">
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input id="email" name="email" type="email" required className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
						</div>
						<div className="relative">
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input id="password" name="password" type="password" required className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
						</div>
						<div className="relative">
							<label htmlFor="confirmPassword" className="sr-only">
								Confirm Password
							</label>
							<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input id="confirmPassword" name="confirmPassword" type="password" required className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
						</div>
					</div>

					<div>
						<button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105">
							Create Account
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Signup;
