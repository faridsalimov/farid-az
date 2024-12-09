"use server";

import { AuthFormData } from "@/types/auth";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import { hash } from "bcryptjs";

export async function login(data: AuthFormData) {
  try {
    await connectDB();

    const user = await User.findOne({ email: data.email.toLowerCase() });

    if (!user) {
      return { success: false, error: "Email və ya şifrə yanlışdır" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Daxil olma xətası baş verdi" };
  }
}

export async function register(data: AuthFormData) {
  try {
    await connectDB();

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: "Düzgün email daxil edin" };
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: data.email.toLowerCase(),
    });
    if (existingUser) {
      return { success: false, error: "Bu email artıq qeydiyyatdan keçib" };
    }

    // Validate password
    if (data.password.length < 6) {
      return { success: false, error: "Şifrə ən azı 6 simvol olmalıdır" };
    }

    // Validate name
    if (!data.name || data.name.length < 2) {
      return { success: false, error: "Ad ən azı 2 simvol olmalıdır" };
    }

    const hashedPassword = await hash(data.password, 12);

    const user = await User.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Return safe user data
    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    return { success: true, user: safeUser };
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return { success: false, error: "Bu email artıq qeydiyyatdan keçib" };
    }

    return { success: false, error: "Qeydiyyat xətası baş verdi" };
  }
}
