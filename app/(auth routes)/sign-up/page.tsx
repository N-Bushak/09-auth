"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./SignUpPage.module.css"; 
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);


  const handleSubmit = async (formData: FormData) => {
    try {
      setError("");

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const user = await register(email, password);
      
      if (user) {
        setUser(user); 
        router.push("/profile"); 
      } else {
        setError("Registration failed. Try again.");
      }
    } catch {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <main className={css.mainContent}>
   
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign up</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
  
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}