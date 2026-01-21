import { useState, useEffect } from "react";
import { useBirthdays } from "@/lib/BirthdayContext";
import loginBg from "@assets/login-bg_1768797328648.png";
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { Toaster, toast } from "sonner";

export default function Login() {
  const { login, register } = useBirthdays();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [suggestedPassword, setSuggestedPassword] = useState("");

  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const special = "!@#$%^&*()";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    
    let pass = "";
    pass += uppercase[Math.floor(Math.random() * uppercase.length)];
    pass += digits[Math.floor(Math.random() * digits.length)];
    pass += special[Math.floor(Math.random() * special.length)];
    
    const all = uppercase + lowercase + digits + special;
    for (let i = 0; i < 7; i++) {
      pass += all[Math.floor(Math.random() * all.length)];
    }
    return pass.split('').sort(() => 0.5 - Math.random()).join('');
  };

  useEffect(() => {
    if (isRegistering) {
      setSuggestedPassword(generateStrongPassword());
    } else {
      setSuggestedPassword("");
    }
  }, [isRegistering]);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("remindme_remember_me") === "true";
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("remindme_remembered_email");
    const savedPassword = localStorage.getItem("remindme_remembered_password");
    if (rememberMe && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasDigits = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*()]/.test(password);
      
      if (!hasUppercase || !hasLowercase || !hasDigits || !hasSpecial || password.length < 8) {
        toast.error("Password must be at least 8 characters and include uppercase, lowercase, digits, and special characters.");
        return;
      }
      
      const success = register({ email, password });
      if (success) {
        setIsRegistering(false);
        setEmail("");
        setPassword("");
      }
      return;
    }

    if (rememberMe) {
      localStorage.setItem("remindme_remembered_email", email);
      localStorage.setItem("remindme_remembered_password", password);
      localStorage.setItem("remindme_remember_me", "true");
    } else {
      localStorage.removeItem("remindme_remembered_email");
      localStorage.removeItem("remindme_remembered_password");
      localStorage.setItem("remindme_remember_me", "false");
    }

    login({ email, password });
  };

  const handleToggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRegistering(!isRegistering);
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="login relative h-screen grid items-center overflow-hidden font-['Poppins',_sans-serif] text-white">
      <Toaster position="top-right" expand={true} richColors />
      <img src={loginBg} alt="login image" className="login__img absolute w-full h-full object-cover object-center" />

      <form 
        onSubmit={handleSubmit}
        className="relative bg-[hsla(0,0%,10%,0.1)] border-2 border-white mx-4 p-8 rounded-[1rem] backdrop-blur-[10px] w-[calc(100%-2rem)] max-w-[400px] sm:mx-auto md:p-12 md:rounded-[2rem]"
      >
        <div className="flex justify-center mb-6">
          <div className="p-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-2xl">
            <AppLogo className="w-24 h-24 rounded-full overflow-hidden" />
          </div>
        </div>
        <h1 className="login__title text-center text-[1.75rem] font-black mb-8 md:text-[2.2rem] tracking-tighter text-white drop-shadow-md">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h1>

        <div className="login__content grid gap-8 mb-8">
          <div className="login__box grid grid-cols-[max-content_1fr] items-center gap-3 border-b-2 border-white pb-1">
            <Mail className="login__icon text-[1.25rem] translate-y-[-2px]" />

            <div className="login__box-input relative">
              <input 
                type="email" 
                required 
                pattern="[a-z0-9._%+-]+@gmail\.com$"
                title="Please enter a valid @gmail.com address"
                className="login__input w-full py-2 background-none text-white relative z-10 bg-transparent outline-none border-none" 
                id="login-email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="login-email" className="login__label absolute left-0 top-[8px] font-medium transition-all duration-300 pointer-events-none">Email</label>
            </div>
          </div>

          <div className="login__box grid grid-cols-[max-content_1fr] items-center gap-3 border-b-2 border-white pb-1">
            <Lock className="login__icon text-[1.25rem] translate-y-[-2px]" />

            <div className="login__box-input relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="login__input w-full py-2 background-none text-white relative z-10 bg-transparent outline-none border-none pr-[1.8rem]" 
                id="login-pass"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="login-pass" className="login__label absolute left-0 top-[8px] font-medium transition-all duration-300 pointer-events-none">Password</label>
              <div 
                className="login__eye absolute right-0 top-[12px] z-20 cursor-pointer text-[1.25rem]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </div>
            </div>
          </div>
          
          {isRegistering && suggestedPassword && (
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">Suggested Password</p>
              <div className="flex items-center justify-between gap-4">
                <code className="text-sm font-mono text-primary font-black bg-white/20 px-2 py-1 rounded">{suggestedPassword}</code>
                <button 
                  type="button"
                  onClick={() => setPassword(suggestedPassword)}
                  className="text-[10px] font-black uppercase bg-white text-black px-3 py-1.5 rounded-lg hover:bg-white/80 transition-colors"
                >
                  Use This
                </button>
              </div>
              <p className="text-[9px] text-white/40 mt-2 font-medium">Includes uppercase, digits, and special characters.</p>
            </div>
          )}
        </div>

        <style>{`
          .login__input:focus + .login__label,
          .login__input:not(:placeholder-shown) + .login__label {
            top: -18px;
            font-size: 0.813rem;
          }
        `}</style>

        {!isRegistering && (
          <div className="login__check flex items-center justify-between mb-6">
            <div className="login__check-group flex items-center gap-2">
              <input 
                type="checkbox" 
                className="login__check-input w-4 h-4" 
                id="login-check" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="login-check" className="login__check-label text-[0.813rem]">Remember me</label>
            </div>

            <a href="#" className="login__forgot text-[0.813rem] text-white hover:underline">Forgot Password?</a>
          </div>
        )}

        <button type="submit" className="login__button w-full p-4 rounded-[0.5rem] bg-white text-black font-medium cursor-pointer mb-8 hover:bg-white/90 transition-colors">
          {isRegistering ? "Register" : "Login"}
        </button>

        <p className="login__register text-center text-[0.813rem]">
          {isRegistering ? "Already have an account?" : "Don't have an account?"} 
          <a 
            href="#" 
            onClick={handleToggleMode}
            className="text-white font-medium hover:underline ml-1"
          >
            {isRegistering ? "Login" : "Register"}
          </a>
        </p>
      </form>
    </div>
  );
}
