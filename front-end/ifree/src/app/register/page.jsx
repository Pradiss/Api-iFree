import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-top"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80')",
        }}
      />

      <div className="absolute inset-0 bg-black/30 md:hidden" />

      <div className="absolute -bottom-24 -left-24 pointer-events-none hidden md:block">
        <div className="w-[520px] h-[520px] rounded-full bg-green-400/20" />
        <div className="absolute top-16 left-16 w-[390px] h-[390px] rounded-full bg-green-400/17" />
        <div className="absolute top-32 left-32 w-[270px] h-[270px] rounded-full bg-green-400/14" />
      </div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:ml-auto md:w-1/2 md:p-12">
        <div className="w-full max-w-[420px] rounded-2xl bg-white px-5 py-8 shadow-2xl sm:px-8 sm:py-10 md:px-10 md:py-12">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
