"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Zap, Github, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-glow">
          <Zap className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Get started with OrionOS
        </p>
      </div>

      <Card glass>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                First name
              </label>
              <Input placeholder="Alex" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Last name
              </label>
              <Input placeholder="Kim" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Email
            </label>
            <Input type="email" placeholder="alex@orion.dev" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full" size="lg">
            Create account
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <Github className="h-4 w-4" />
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
