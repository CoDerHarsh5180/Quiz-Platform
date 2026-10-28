import React, { useState } from "react";

import { verifyOTP, registerUser } from "../Api/authApi";
import { X } from "lucide-react";
import { useAuth } from "../context/teacherContext";
const RegisterPage = ({cancel}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [experience, setExperience] = useState("");
    const [field, setField] = useState("JEE");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    // const navigate = useNavigate()
    const {registerForm, setRegisterForm, setLoginForm} = useAuth()

  return (
    <div className="flex items-center justify-center  ">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 relative">
        <span className="absolute top-0 right-0 p-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={()=>{setRegisterForm(false)}}>
          <X />
        </span>
        <h2 className="text-2xl font-semibold text-center mb-2">Create an account</h2>
        <p className="text-gray-600 text-center mb-6">
          SIGN UP to प्रश्णोत्तर
        </p>

        {/* Form */}
        <form  className="space-y-1 md:text-sm text-xs md:grid grid-cols-2 gap-2">


            <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Experience"
                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Field
              </label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              >
                
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="OLYMPIAD">OLYMPIAD</option>
                <option value="SCHOOL">SCHOOL</option>
                <option value="GOVT-EXAMS PREP">GOVT-EXAMS PREP</option>
              </select>
            </div>

          <button
          onClick={(e)=>{e.preventDefault(); registerUser(name, email, username, experience, field, password)}}
            className="w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition"
          >
            Send OTP
          </button>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                verifyOTP(name, email, username, experience, field, password, otp);
              }}
              className="w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition"
            >
              Verify OTP
            </button>
          
        </form>


        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <button onClick={()=>{
            setLoginForm(true);
            setRegisterForm(false)
          }}>Login Now</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
