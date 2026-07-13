import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ShieldOff } from "lucide-react";

export function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F3E9] flex items-center justify-center">
      <div className="text-center">
        <ShieldOff size={40} className="text-[#5C6B5C] mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="text-xl font-semibold text-[#2C5F2D] mb-2">Not Authorized</h1>
        <p className="text-sm text-[#5C6B5C] mb-6">You don't have permission to access this page.</p>
        <Button onClick={() => navigate("/pos")}>Return to POS</Button>
      </div>
    </div>
  );
}
