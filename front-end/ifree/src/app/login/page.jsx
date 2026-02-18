import LoginForm from "../../components/auth/LoginForm";


export default function Login() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      {/* LADO ESQUERDO */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-green-900 to-black text-white flex flex-col justify-center p-12">
        <span className="italic text-lg mb-4">Log in</span>

        <h1 className="text-6xl font-extrabold leading-tight">
          WELCOME <br /> BACK
        </h1>

        <p className="mt-6 text-sm text-gray-300 max-w-sm">
          Sign back in to your account to access your courses and embody the art of being human.
        </p>
      </div>

      {/* LADO DIREITO */}
      <div className="md:w-1/2 w-full bg-[#e8dccc] flex items-center justify-center p-12">
        <LoginForm />
      </div>

    </div>
  );
}
