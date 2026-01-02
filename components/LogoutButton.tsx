"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signout } from "@/lib/auth-actions";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signout()}
      className="text-sm"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
