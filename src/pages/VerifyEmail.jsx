import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import loginBG from "../../public/login-bg.jpg";
import logo from "../../public/image.svg";

import { Loader2, MailCheck, ShieldAlert, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const verificationStarted = useRef(false);

  useEffect(() => {

    if(!token||verificationStarted.current){
        return;
    }

    verificationStarted.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/users/verify-email/${token}`,
        );

        const data = await response.json();

        if (!response.ok) {
          setStatus("expired");
          setMessage(
            data.message || "This verification link is invalid or expired.",
          );
          console.log(message);
          return;
        }

        setStatus("verified");
        setMessage(data.message || "Email verified successfully!");
        console.log(message);
      } catch (error) {
        console.error("Email verification failed:", error);

        setStatus("expired");
        setMessage("Something went wrong. Please try again later.");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

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
              {status === "verifying" && (
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/30">
                  <Loader2 className="w-9 h-9 text-primary animate-spin" />
                </div>
              )}

              {status === "verified" && (
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 border border-primary/40 shadow-[var(--glow-primary)]">
                  <MailCheck className="w-9 h-9 text-primary" />
                </div>
              )}

              {status === "expired" && (
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30">
                  <ShieldAlert className="w-9 h-9 text-red-500" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="text-center space-y-2">
              {status === "verifying" && (
                <>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Verifying your email…
                  </h1>

                  <p className="text-sm sm:text-base text-muted-foreground">
                    Hold tight — we're confirming your link.
                  </p>
                </>
              )}

              {status === "verified" && (
                <>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    You're verified! 🎸
                  </h1>

                  <p className="text-sm sm:text-base text-muted-foreground">
                    {message}
                  </p>
                </>
              )}

              {status === "expired" && (
                <>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Link expired
                  </h1>

                  <p className="text-sm sm:text-base text-muted-foreground">
                    {message}
                  </p>
                </>
              )}
            </div>

            {/* Perforation */}
            <div className="relative flex items-center" aria-hidden>
              <div className="absolute -left-7 sm:-left-9 w-5 h-5 rounded-full bg-background border-r border-white/15" />

              <div className="flex-1 border-t-2 border-dashed border-white/15" />

              <div className="absolute -right-7 sm:-right-9 w-5 h-5 rounded-full bg-background border-l border-white/15" />
            </div>

            {/* Actions */}

            {status === "verified" && (
              <Button
                onClick={() => navigate("/feed")}
                className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--glow-primary)]"
              >
                Start discovering
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {status === "verifying" && (
              <div className="h-12 flex items-center justify-center text-sm text-muted-foreground">
                This usually takes a few seconds…
              </div>
            )}

            {status === "expired" && (
              <Button
                onClick={() => navigate("/register")}
                variant="outline"
                className="w-full h-12 border-white/15 bg-white/5 text-foreground hover:bg-white/10"
              >
                Go back to signup
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-[10px] tracking-[0.3em] text-white/20 uppercase">
          Backstage pass · Admit one
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
