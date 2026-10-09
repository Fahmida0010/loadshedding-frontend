"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure";
import { useAuthStore } from "@/src/store/useAuthStore"; // Zustand store import

export default function RegisterPage() {
	const router = useRouter();
	const axiosSecure = useAxiosSecure();
	const { login } = useAuthStore(); // login action

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		role: "CUSTOMER",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res: any = await axiosSecure.post("/auth/register", formData);
			console.log("Full Register Response:", res);

			// ব্যাকএন্ড রেসপন্সের নেস্টেড স্ট্রাকচার অনুযায়ী সঠিক পাথ:
			const token =
				res?.data?.data?.accessToken ||
				res?.data?.accessToken ||
				res?.accessToken;
			const responseUser =
				res?.data?.data?.user || res?.data?.user || res?.user;

			if (token) {
				localStorage.setItem("token", token);
				console.log("Token successfully saved:", token);
			} else {
				console.error("CRITICAL: Token field is still missing!", res);
			}

			// Zustand store-এ লগইন স্টেট আপডেট করা
			login(responseUser, token);

			// রোল অনুযায়ী ড্যাশবোর্ডে রিডাইরেক্ট করা
			const role = responseUser?.role || formData.role;
			if (role === "ADMIN") {
				router.push("/dashboard/admin");
			} else if (role === "TECHNICIAN") {
				router.push("/dashboard/technician");
			} else {
				router.push("/dashboard/customer");
			}
		} catch (err: any) {
			console.log("Register Error:", err);

			if (
				err?.errorSources &&
				Array.isArray(err?.errorSources) &&
				err.errorSources.length > 0
			) {
				const errorMessages = err.errorSources
					.map((item: any) => item.message)
					.join(" • ");
				setError(errorMessages);
			} else {
				setError(
					err?.message ||
						err?.response?.data?.message ||
						"Registration failed. Please try again.",
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
			<div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-100 space-y-6">
				<div className="text-center space-y-1">
					<h1 className="text-3xl font-extrabold text-gray-900">
						Create Account 🚀
					</h1>
					<p className="text-sm text-gray-600">Sign up to get started</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
						{error}
					</div>
				)}

				<form onSubmit={handleRegister} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Full Name
						</label>
						<input
							type="text"
							name="name"
							required
							value={formData.name}
							onChange={handleChange}
							placeholder="John Doe"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email Address
						</label>
						<input
							type="email"
							name="email"
							required
							value={formData.email}
							onChange={handleChange}
							placeholder="john@example.com"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Phone Number
						</label>
						<input
							type="text"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							placeholder="+8801XXXXXXXXX"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								required
								value={formData.password}
								onChange={handleChange}
								placeholder="••••••••"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 pr-12"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-700 focus:outline-none"
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Role
						</label>
						<select
							name="role"
							value={formData.role}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
						>
							<option value="CUSTOMER">Customer</option>
							<option value="TECHNICIAN">Technician</option>
						</select>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md disabled:opacity-50"
					>
						{loading ? "Creating Account..." : "Register"}
					</button>
				</form>

				<p className="text-center text-sm text-gray-600">
					Already have an account?{" "}
					<Link
						href="/auth/login"
						className="text-blue-600 font-medium hover:underline"
					>
						Login here
					</Link>
				</p>
			</div>
		</div>
	);
}
