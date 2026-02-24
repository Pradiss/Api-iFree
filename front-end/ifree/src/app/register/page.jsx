import RegisterForm from "../../components/auth/RegisterForm"

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <div className="md:w-1/2 w-full bg-gradient-to-br from-green-900 to-black text-white flex flex-col justify-center p-12">
        
        <span className="italic text-lg">Create Account</span>

        <h1 className="text-7xl font-extrabold leading-tight">
          JOIN <br /> US
        </h1>

        <p className="mt-6 text-sm text-gray-300 max-w-sm">
          Create your account and start connecting with musicians, bands,
          and establishments. Discover opportunities and grow your network.
        </p>
      </div>

      <div className="md:w-1/2 w-full bg-[#e8dccc] flex items-center justify-center p-12">
        <RegisterForm />
      </div>
    </div>
  );
}