import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const SupabaseDebug: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [email] = useState("vignezhm@gmail.com");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Test basic connection
      const { data: adminUsers, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email);

      setResult(
        (prev) => prev + `\nAdmin users: ${JSON.stringify(adminUsers, null, 2)}`
      );
      if (adminError) {
        setResult((prev) => prev + `\nAdmin error: ${adminError.message}`);
      }

      // Check current session
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      setResult(
        (prev) =>
          prev +
          `\nCurrent session: ${
            sessionData.session ? "Logged in" : "Not logged in"
          }`
      );
      if (sessionError) {
        setResult((prev) => prev + `\nSession error: ${sessionError.message}`);
      }
    } catch (error) {
      setResult((prev) => prev + `\nConnection error: ${error}`);
    }
  };

  const createAdminUser = async () => {
    try {
      // First, sign up the user in Supabase Auth
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        setResult((prev) => prev + `\nSignUp error: ${signUpError.message}`);
        return;
      }

      setResult(
        (prev) =>
          prev + `\nUser created: ${JSON.stringify(signUpData.user?.email)}`
      );

      // Then add them to admin_users table
      if (signUpData.user) {
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .insert([
            {
              id: signUpData.user.id,
              email: signUpData.user.email,
              is_active: true,
              created_at: new Date().toISOString(),
            },
          ]);

        if (adminError) {
          setResult(
            (prev) => prev + `\nAdmin insert error: ${adminError.message}`
          );
        } else {
          setResult(
            (prev) =>
              prev + `\nAdmin user added to table: ${JSON.stringify(adminData)}`
          );
        }
      }
    } catch (error) {
      setResult((prev) => prev + `\nCreate admin error: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setResult((prev) => prev + `\nLogin error: ${error.message}`);
      } else {
        setResult(
          (prev) =>
            prev + `\nLogin success: ${JSON.stringify(data.user?.email)}`
        );
      }
    } catch (error) {
      setResult((prev) => prev + `\nLogin exception: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Supabase Debug Console</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Password for {email}:
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter admin password"
        />
      </div>

      <div className="space-x-4 mb-4">
        <button
          onClick={checkConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check Connection
        </button>
        <button
          onClick={createAdminUser}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!password}
        >
          Create Admin User
        </button>
        <button
          onClick={testLogin}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          disabled={!password}
        >
          Test Login
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
      </div>
    </div>
  );
};
