"use client";

import type React from "react";
import { useState } from "react";
import { FaBell, FaGlobe, FaLock, FaMoon, FaSun } from "react-icons/fa";
import Swal from "sweetalert2";
import { useThemeLanguage } from "@/src/context/ThemeLanguageContext";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure";

export default function SettingsPage() {
	const axiosSecure = useAxiosSecure();
	const { darkMode, toggleDarkMode, language, changeLanguage, t } =
		useThemeLanguage();

	// Password Form State
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loadingPassword, setLoadingPassword] = useState(false);

	const [emailNotifications, setEmailNotifications] = useState(true);
	const [pushNotifications, setPushNotifications] = useState(true);

	// Handle Password Change
	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			Swal.fire({
				icon: "error",
				title: "Mismatch",
				text: "New password and confirm password do not match!",
			});
			return;
		}

		try {
			setLoadingPassword(true);
			await axiosSecure.patch("/auth/change-password", {
				currentPassword,
				newPassword,
			});

			Swal.fire({
				icon: "success",
				title: "Password Changed!",
				text: "Your password has been updated successfully.",
			});

			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error: any) {
			Swal.fire({
				icon: "error",
				title: "Failed",
				text: error.response?.data?.message || "Failed to change password",
			});
		} finally {
			setLoadingPassword(false);
		}
	};

	const handleSavePreferences = () => {
		Swal.fire({
			icon: "success",
			title: "Preferences Saved",
			text: "Your settings have been updated successfully.",
			timer: 1500,
			showConfirmButton: false,
		});
	};

	return (
		<div className="p-3 sm:p-6 max-w-4xl mx-auto w-full">
			<h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
				{language === "bn"
					? "অ্যাকাউন্ট এবং সিস্টেম সেটিংস"
					: "Account & System Settings"}
			</h1>

			<div className="space-y-6">
				{/* Dark / Light Mode Toggle */}
				<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
					<h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
						{darkMode ? (
							<FaMoon className="text-blue-400" />
						) : (
							<FaSun className="text-amber-500" />
						)}
						{language === "bn" ? "থিম এবং অ্যাপিয়ারেন্স" : "Appearance & Theme"}
					</h2>
					<div className="flex items-center justify-between py-2">
						<div>
							<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
								{t("darkMode")}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{language === "bn"
									? "লাইট এবং ডার্ক মোডের মধ্যে স্যুইচ করুন"
									: "Switch between light and dark themes"}
							</p>
						</div>
						<button
							onClick={toggleDarkMode}
							type="button"
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								darkMode ? "bg-blue-600" : "bg-gray-300"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									darkMode ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</div>

				{/* Language Selection */}
				<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
					<h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
						<FaGlobe className="text-emerald-500" />{" "}
						{language === "bn" ? "ভাষা এবং অঞ্চল" : "Language & Region"}
					</h2>
					<div className="max-w-xs">
						<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							{language === "bn" ? "পছন্দের ভাষা" : "Preferred Language"}
						</label>
						<select
							value={language}
							onChange={(e) => changeLanguage(e.target.value)}
							className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="en">English</option>
							<option value="bn">Bengali (বাংলা)</option>
						</select>
					</div>
					<div className="mt-4 flex justify-end">
						<button
							type="button"
							onClick={handleSavePreferences}
							className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition"
						>
							{t("savePreferences")}
						</button>
					</div>
				</div>

				{/* Change Password Section */}
				<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
					<h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
						<FaLock className="text-purple-500" />{" "}
						{language === "bn" ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password"}
					</h2>
					<form onSubmit={handleChangePassword} className="space-y-4">
						<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								{language === "bn" ? "বর্তমান পাসওয়ার্ড" : "Current Password"}
							</label>
							<input
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
								placeholder="••••••••"
								className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-md w-full sm:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									{language === "bn" ? "নতুন পাসওয়ার্ড" : "New Password"}
								</label>
								<input
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									required
									placeholder="••••••••"
									className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-md w-full text-sm"
								/>
							</div>
							<div>
								<label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									{language === "bn" ? "কনফার্ম পাসওয়ার্ড" : "Confirm New Password"}
								</label>
								<input
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
									placeholder="••••••••"
									className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-md w-full text-sm"
								/>
							</div>
						</div>

						<div className="flex justify-end pt-2">
							<button
								type="submit"
								disabled={loadingPassword}
								className="bg-gray-800 dark:bg-gray-700 text-word text-white px-4 py-2 rounded-md hover:bg-gray-900 text-sm font-medium disabled:opacity-50"
							>
								{loadingPassword
									? language === "bn"
										? "আপডেট হচ্ছে..."
										: "Updating..."
									: language === "bn"
										? "পাসওয়ার্ড আপডেট করুন"
										: "Update Password"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
