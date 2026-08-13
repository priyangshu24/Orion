"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, BarChart3, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound, Zap } from "lucide-react";
import styles from "./auth-screen.module.css";

type AuthMode = "login" | "register";

const benefits = [
  { icon: ShieldCheck, title: "Secure & Reliable", copy: "Enterprise-grade security to protect your data." },
  { icon: Zap, title: "Quick Onboarding", copy: "Get started in minutes and see results faster." },
  { icon: BarChart3, title: "Built for Growth", copy: "Powerful features to scale with your business." },
];

function Brand() {
  return (
    <div className={styles.brand} aria-label="Orion — Ask more from CRM">
      <Image
        src="/orion-logo-full.png"
        alt="Orion — Ask more from CRM"
        width={2172}
        height={724}
        priority
        sizes="(max-width: 600px) 260px, 330px"
        className={styles.brandLogo}
      />
    </div>
  );
}

function Field({ label, type = "text", name, placeholder, icon: Icon, trailing }: {
  label: string;
  type?: string;
  name: string;
  placeholder: string;
  icon: typeof Mail;
  trailing?: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <span className={styles.inputShell}>
        <Icon aria-hidden="true" />
        <input type={type} name={name} placeholder={placeholder} autoComplete={name} />
        {trailing}
      </span>
    </label>
  );
}

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.story}>
          <Brand />
          <div className={styles.pitch}>
            <h1>Smarter <em>CRM.</em><br />Stronger Relationships.</h1>
            <p>
              Join Orion CRM and experience a smarter<br className={styles.desktopBreak} /> way to manage, automate, and grow<br className={styles.desktopBreak} /> your business.
            </p>
          </div>
          <div className={styles.benefits}>
            {benefits.map(({ icon: Icon, title, copy }) => (
              <article key={title}>
                <span className={styles.benefitIcon}><Icon aria-hidden="true" /></span>
                <h2>{title}</h2>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <p className={styles.copyright}>© 2026 Orion CRM. All rights reserved.</p>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.formGlow} aria-hidden="true" />
          <div className={styles.panelStar} aria-hidden="true">✦</div>
          <header className={styles.formHeader}>
            <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
            <p>{isRegister ? "Start your 14-day free trial. No credit card required." : "Sign in to continue to your Orion CRM workspace."}</p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit}>
            {isRegister ? <Field label="Full name" name="name" placeholder="Enter your full name" icon={UserRound} /> : null}
            <Field label="Work email" type="email" name="email" placeholder="Enter your work email" icon={Mail} />
            <Field
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={isRegister ? "Create a strong password" : "Enter your password"}
              icon={LockKeyhole}
              trailing={
                <button type="button" className={styles.eyeButton} onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              }
            />

            {isRegister ? (
              <>
                <div className={styles.requirements} aria-label="Password requirements">
                  <span>✓ At least 8 characters</span><span>✓ Contains a number</span><span>✓ Contains an uppercase letter</span>
                </div>
                <Field
                  label="Confirm password"
                  type={showConfirmation ? "text" : "password"}
                  name="new-password"
                  placeholder="Confirm your password"
                  icon={LockKeyhole}
                  trailing={
                    <button type="button" className={styles.eyeButton} onClick={() => setShowConfirmation((visible) => !visible)} aria-label={showConfirmation ? "Hide password" : "Show password"}>
                      {showConfirmation ? <EyeOff /> : <Eye />}
                    </button>
                  }
                />
                <label className={styles.terms}>
                  <input type="checkbox" name="terms" />
                  <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a></span>
                </label>
              </>
            ) : (
              <div className={styles.loginOptions}>
                <label><input type="checkbox" name="remember" /> Remember me</label>
                <a href="#forgot-password">Forgot password?</a>
              </div>
            )}

            <button type="submit" className={styles.primaryButton}>
              {isRegister ? "Create account" : "Sign in"}<ArrowRight aria-hidden="true" />
            </button>
            <div className={styles.divider}><span>OR</span></div>
            <button type="button" className={styles.googleButton}>
              <span className={styles.googleIcon}>G</span>{isRegister ? "Sign up with Google" : "Continue with Google"}
            </button>
          </form>

          <p className={styles.switchMode}>
            {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
            <Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create account"}</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
