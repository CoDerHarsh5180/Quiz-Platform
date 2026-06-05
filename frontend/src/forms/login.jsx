import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { loginUser } from "../Api/apirequests";
import { X } from "lucide-react";
import { useAuth } from "../context/teacherContext";
const LoginPage = ({cancel}) => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate()
    const {loginForm, setLoginForm, setRegisterForm} = useAuth()

  return (
    <div className="flex items-center justify-center  ">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 relative">
        <span className="absolute top-0 right-0 p-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={()=>{setLoginForm(false)}}>
          <X />
        </span>
        <h2 className="text-2xl font-semibold text-center mb-2">Welcome back</h2>
        <p className="text-gray-600 text-center mb-6">
          LOGIN to प्रश्णोत्तर
        </p>

        {/* Form */}
        <form  className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              EMAIL or USERNAME
            </label>
            <input
              type="email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="email or username"
              className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              required
            />
          </div>

          <button
          onClick={(e)=>{e.preventDefault(); loginUser(name, password).then((data)=>{console.log(data)}).catch((e)=>{console.log(e)})}}
            className="w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition"
          >
            Sign in →
          </button>
        </form>


        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <button onClick={()=>{
            setLoginForm(false)
            setRegisterForm(true)
          }}>Register Now</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
