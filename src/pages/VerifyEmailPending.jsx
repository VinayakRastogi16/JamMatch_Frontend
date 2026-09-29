import { useNavigate } from "react-router-dom";
import loginBG from "../assets/login-bg.jpg";
import logo from "../assets/image.svg";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "../services/api";
import { useState, useEffect } from "react";

const VerifyEmailPending = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const resendVerificationMail = async () => {
    if (cooldown > 0) return;

    try {
      setLoading(true);
      setMessage("");

      const res = await API.post("/resend-verification", {
        email: user.email,
      });

      setSent(true);
      setMessage(res.data.message);
      setCooldown(60);
    } catch (e) {
      setMessage(
        e.response?.data?.message || "Failed to resend verification email",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await API.get("/email-verification-status");

        if (res.data.emailVerified) {
          navigate("/feed");
        }
      } catch (e) {
        console.error("Failed to check verification status", e);
      }
    };

    getStatus();
  }, [navigate]);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background font-sans px-4 py-10">
      {/* Background */}
      <img
        src={loginBG}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />

      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/10 rounded-full backdrop-blur-lg blur-3xl animate-pulse pointer-events-none" />

      <div
        className="fixed bottom-0 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-2xl shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Gradient top */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-pink-600/80 to-primary" />

          <div className="p-7 sm:p-9 space-y-7">
            {/* Logo */}
            <div className="flex items-center">
              <img src={logo} alt="JamMatch" className="h-20 w-20" />
            </div>

            {/* Status Icon */}
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/30 mb-10">
                {sent ? (
                  <Check className="w-9 h-9 text-primary" />
                ) : (
                  <Loader2 className="w-9 h-9 text-primary animate-spin" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-3">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                {sent ? "Verification email sent" : "Get yourself verified"}
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground">
                {sent
                  ? "We've sent you a new verification link. Check your inbox."
                  : "We have sent you a verification email."}
              </p>

              {/* Perforation */}
              <div className="relative flex items-center" aria-hidden>
                <div className="absolute -left-7 sm:-left-9 w-5 h-5 rounded-full bg-background border-r border-white/15" />

                <div className="flex-1 border-t-2 border-dashed border-white/15" />

                <div className="absolute -right-7 sm:-right-9 w-5 h-5 rounded-full bg-background border-l border-white/15" />
              </div>

              {/* Button */}
              {cooldown > 0 ? (
                <Button
                  disabled
                  className="w-full h-12 text-base font-semibold"
                >
                  Resend link in {cooldown}s
                </Button>
              ) : (
                <Button
                  onClick={resendVerificationMail}
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--glow-primary)]"
                >
                  {loading ? "Sending..." : "Resend verification email"}

                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {message && (
                <p className="text-center text-sm text-muted-foreground">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
        </div>
        <p className="mt-5 text-center text-[10px] tracking-[0.3em] text-white/20 uppercase">
          Backstage pass · Admit one
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPending;
